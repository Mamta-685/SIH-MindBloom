import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getMoods, getProgress } from '../utils/persistence';

const Dashboard = () => {
  const navigate = useNavigate();
  const { userName, currentMood, progress, updateProgress } = useApp();
  const [recentMoods, setRecentMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [moods, userProgress] = await Promise.all([
        getMoods('guest'),
        getProgress('guest')
      ]);
      
      setRecentMoods(moods.slice(0, 7)); // Last 7 days
      updateProgress(userProgress);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      neutral: '😐',
      sad: '😔',
      worried: '😟',
      tired: '😴'
    };
    return moodMap[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      happy: 'from-yellow-400 to-orange-400',
      neutral: 'from-gray-400 to-gray-500',
      sad: 'from-blue-400 to-indigo-400',
      worried: 'from-orange-400 to-red-400',
      tired: 'from-purple-400 to-indigo-400'
    };
    return colorMap[mood] || 'from-gray-400 to-gray-500';
  };

  const quickActions = [
    {
      title: 'Breathe',
      description: 'Take a mindful moment',
      icon: '🌬️',
      color: 'from-green-400 to-purple-400',
      action: () => navigate('/breathing')
    },
    {
      title: 'Journal',
      description: 'Express your thoughts',
      icon: '📝',
      color: 'from-purple-400 to-orange-400',
      action: () => navigate('/journal')
    },
    {
      title: 'Connect',
      description: 'Share with others',
      icon: '💬',
      color: 'from-orange-400 to-green-400',
      action: () => navigate('/connect')
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600">
          How are you feeling today?
        </p>
      </motion.div>

      {/* Current Mood Display */}
      {currentMood && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card mb-6 text-center"
        >
          <h2 className="text-xl font-semibold mb-4">Today's Mood</h2>
          <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getMoodColor(currentMood.mood)} flex items-center justify-center text-4xl shadow-lg`}>
            {getMoodEmoji(currentMood.mood)}
          </div>
          <p className="mt-4 text-lg font-medium capitalize">
            {currentMood.mood}
          </p>
        </motion.div>
      )}

      {/* Growth Tree Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Growth Tree</h2>
          <button
            onClick={() => navigate('/growth')}
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View Full Tree
          </button>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Tree trunk */}
            <div className="w-8 h-16 bg-amber-600 rounded-full mx-auto"></div>
            
            {/* Leaves */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              {Array.from({ length: Math.min(progress.leavesCount, 10) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute w-4 h-4 bg-green-500 rounded-full"
                  style={{
                    left: `${Math.cos(i * 0.6) * 20}px`,
                    top: `${Math.sin(i * 0.6) * 20}px`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-center mt-4 text-gray-600">
          {progress.leavesCount} leaves grown • Level {progress.treeLevel}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              onClick={action.action}
              className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{action.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{action.title}</h3>
                  <p className="text-white/80">{action.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Moods</h2>
          <div className="flex justify-center space-x-2">
            {recentMoods.map((mood, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMoodColor(mood.mood)} flex items-center justify-center text-xl shadow-md`}>
                  {getMoodEmoji(mood.mood)}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Check-in prompt if no recent mood */}
      {recentMoods.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="card text-center"
        >
          <p className="text-gray-600 mb-4">
            Ready to check in with how you're feeling?
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Check In
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
