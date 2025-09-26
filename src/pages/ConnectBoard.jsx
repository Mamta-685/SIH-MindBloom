import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getPosts, savePost } from '../utils/persistence';

const ConnectBoard = () => {
  const { addLeaf, completeActivity } = useApp();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [filter, setFilter] = useState('all'); // all, recent, supportive

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await getPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return;

    setIsSaving(true);
    try {
      const postData = {
        message: newPost.trim(),
        userId: 'anonymous'
      };

      const savedPost = await savePost(postData);
      setPosts(prev => [savedPost, ...prev]);
      
      // Add leaf for supportive action
      addLeaf();
      await completeActivity('supportive_post');

      // Reset form
      setNewPost('');
      setShowNewPost(false);

    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to post message. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getFilteredPosts = () => {
    let filtered = [...posts];
    
    switch (filter) {
      case 'recent':
        filtered = filtered.slice(0, 10);
        break;
      case 'supportive':
        filtered = filtered.filter(post => 
          post.message.toLowerCase().includes('support') ||
          post.message.toLowerCase().includes('you\'re not alone') ||
          post.message.toLowerCase().includes('hang in there') ||
          post.message.toLowerCase().includes('thinking of you')
        );
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getRandomEmoji = () => {
    const emojis = ['💙', '💚', '💜', '🤗', '🌟', '✨', '💫', '🌈'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Connect</h1>
        <p className="text-gray-600">Share support and encouragement with others</p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center space-x-2 mb-6"
      >
        {[
          { key: 'all', label: 'All Posts' },
          { key: 'recent', label: 'Recent' },
          { key: 'supportive', label: 'Supportive' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-mint-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </motion.div>

      {/* New Post Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <button
          onClick={() => setShowNewPost(true)}
          className="btn-primary text-lg px-8 py-4"
        >
          Share Support 💙
        </button>
      </motion.div>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-lg w-full"
            >
              <h2 className="text-xl font-semibold mb-4">Share Your Support</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your message
                </label>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 h-32 resize-none"
                  placeholder="Share encouragement, support, or a kind message..."
                  maxLength={280}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {newPost.length}/280
                </div>
              </div>

              <div className="bg-lavender-50 border border-lavender-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">
                  💡 <strong>Tip:</strong> Share something supportive like "You're not alone" or "Hang in there" to help others feel connected.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="btn-ghost"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPost}
                  className="btn-primary"
                  disabled={!newPost.trim() || isSaving}
                >
                  {isSaving ? 'Posting...' : 'Post Message'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts List */}
      <div className="space-y-4">
        {getFilteredPosts().length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === 'supportive' ? 'No supportive posts found' : 'No posts yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'supportive' 
                ? 'Try viewing all posts or share some support yourself.'
                : 'Be the first to share a supportive message!'
              }
            </p>
            <button
              onClick={() => setShowNewPost(true)}
              className="btn-primary"
            >
              Share First Message
            </button>
          </motion.div>
        ) : (
          getFilteredPosts().map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">
                  {getRandomEmoji()}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-2 whitespace-pre-wrap">
                    {post.message}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Anonymous</span>
                    <span>{formatTimeAgo(post.createdAt || post.date)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card mt-6"
      >
        <h3 className="text-lg font-semibold mb-3">Community Guidelines</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Be kind and supportive to others</p>
          <p>• Share encouragement and positive messages</p>
          <p>• Respect everyone's privacy and anonymity</p>
          <p>• Remember that everyone is going through their own journey</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectBoard;
