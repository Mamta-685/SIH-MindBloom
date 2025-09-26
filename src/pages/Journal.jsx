import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getJournalEntries, saveJournalEntry, deleteJournalEntry } from '../utils/persistence';
import Sentiment from 'sentiment';

const Journal = () => {
  const { addLeaf, completeActivity, progress } = useApp();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const sentiment = new Sentiment();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const journalEntries = await getJournalEntries('guest');
      setEntries(journalEntries);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeSentiment = (text) => {
    const result = sentiment.analyze(text);
    if (result.score > 0) return { label: 'Positive', emoji: '😊', color: 'text-green-600' };
    if (result.score < 0) return { label: 'Negative', emoji: '😔', color: 'text-red-600' };
    return { label: 'Neutral', emoji: '😐', color: 'text-gray-600' };
  };

  const getEmpatheticMessage = (sentiment) => {
    const messages = {
      Positive: [
        "It's wonderful to see you feeling positive! Keep nurturing that joy.",
        "Your positive energy is inspiring. Thank you for sharing this moment.",
        "I'm so glad you're experiencing these good feelings. You deserve them."
      ],
      Negative: [
        "I hear you, and I want you to know that your feelings are valid. You're not alone.",
        "It takes courage to acknowledge difficult feelings. Would you like a gentle breathing exercise?",
        "I'm here with you through this. Sometimes just writing it down helps. Would you like to try a quick reset?"
      ],
      Neutral: [
        "Thank you for taking the time to reflect. Every moment of self-awareness matters.",
        "I appreciate you sharing your thoughts. Sometimes neutral moments are just as important.",
        "Your willingness to check in with yourself is a beautiful act of self-care."
      ]
    };
    
    const messageList = messages[sentiment.label] || messages.Neutral;
    return messageList[Math.floor(Math.random() * messageList.length)];
  };

  const handleSaveEntry = async () => {
    if (!newEntry.content.trim()) return;

    setIsSaving(true);
    try {
      const sentimentResult = analyzeSentiment(newEntry.content);
      const empatheticMessage = getEmpatheticMessage(sentimentResult);

      const entryData = {
        title: newEntry.title || 'Untitled',
        content: newEntry.content,
        tags: newEntry.tags,
        sentiment: sentimentResult,
        empatheticMessage,
        userId: 'guest'
      };

      const savedEntry = await saveJournalEntry(entryData);
      setEntries(prev => [savedEntry, ...prev]);
      
      // Add leaf for journaling
      addLeaf();
      await completeActivity('journal_entry');

      // Reset form
      setNewEntry({ title: '', content: '', tags: [] });
      setShowNewEntry(false);

      // Show empathetic message
      alert(empatheticMessage);

    } catch (error) {
      console.error('Failed to save journal entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      await deleteJournalEntry(entryId);
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Journal</h1>
          <p className="text-gray-600">Express your thoughts and feelings</p>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="btn-primary"
        >
          New Entry
        </button>
      </motion.div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
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
              className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-4">New Journal Entry</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    placeholder="Give your entry a title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 h-40 resize-none"
                    placeholder="Write about your day, your feelings, your thoughts..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (optional)
                  </label>
                  <input
                    type="text"
                    value={newEntry.tags.join(', ')}
                    onChange={(e) => setNewEntry(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    placeholder="gratitude, reflection, goals..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewEntry(false)}
                  className="btn-ghost"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEntry}
                  className="btn-primary"
                  disabled={!newEntry.content.trim() || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No entries yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your journaling journey by writing your first entry.
            </p>
            <button
              onClick={() => setShowNewEntry(true)}
              className="btn-primary"
            >
              Write Your First Entry
            </button>
          </motion.div>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {entry.title || 'Untitled'}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${entry.sentiment?.color || 'text-gray-600'}`}>
                    {entry.sentiment?.emoji} {entry.sentiment?.label}
                  </span>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                {entry.content}
              </p>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {entry.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-mint-100 text-mint-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {entry.empatheticMessage && (
                <div className="bg-lavender-50 border-l-4 border-lavender-400 p-3 rounded-r-lg mb-3">
                  <p className="text-sm text-gray-700 italic">
                    💜 {entry.empatheticMessage}
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500">
                {formatDate(entry.createdAt || entry.date)}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
