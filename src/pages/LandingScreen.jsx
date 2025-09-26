import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { saveMood } from '../utils/persistence';

const LandingScreen = () => {
  const navigate = useNavigate();
  const { userName, setUserName, setCurrentMood } = useApp();
  const [name, setName] = useState(userName);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😟', label: 'Worried', value: 'worried' },
    { emoji: '😴', label: 'Tired', value: 'tired' }
  ];

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    setIsAnimating(true);
    
    // Save mood to persistence layer
    try {
      const moodData = await saveMood({
        mood: mood.value,
        userId: 'guest'
      });
      setCurrentMood(moodData);
    } catch (error) {
      console.error('Failed to save mood:', error);
    }

    // Animate and navigate
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setUserName(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Sprout Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-purple-400 rounded-full flex items-center justify-center text-4xl shadow-2xl"
          animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          🌱
        </motion.div>
      </motion.div>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Hey {name === 'Guest' ? 'there' : name}, how are you feeling right now?
        </h1>
        
        {/* Name input if still guest */}
        {name === 'Guest' && (
          <form onSubmit={handleNameSubmit} className="mt-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should I call you?"
              className="px-4 py-2 border border-mint-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500 text-center"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
            >
              Set Name
            </button>
          </form>
        )}
      </motion.div>

      {/* Mood Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => handleMoodSelect(mood)}
            className={`mood-btn ${
              selectedMood?.value === mood.value
                ? 'bg-green-500 text-white shadow-xl scale-110'
                : 'bg-white/80 hover:bg-green-100 text-gray-700'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={isAnimating}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </motion.div>

      {/* Mood Labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="flex flex-wrap justify-center gap-8 text-sm text-gray-600"
      >
        {moods.map((mood) => (
          <span key={mood.value} className="text-center">
            <div className="text-2xl mb-1">{mood.emoji}</div>
            <div>{mood.label}</div>
          </span>
        ))}
      </motion.div>

      {/* Encouraging message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mt-8 text-center text-gray-600 max-w-md"
      >
        <p className="text-lg">
          {selectedMood ? (
            <span className="text-green-600 font-medium">
              {selectedMood.value === 'happy' && "That's wonderful! Let's keep that positive energy flowing."}
              {selectedMood.value === 'neutral' && "That's perfectly okay. Every feeling is valid."}
              {selectedMood.value === 'sad' && "I'm here for you. Let's work through this together."}
              {selectedMood.value === 'worried' && "It's okay to feel worried. You're not alone in this."}
              {selectedMood.value === 'tired' && "Rest is important. Let's find some gentle ways to recharge."}
            </span>
          ) : (
            "Take your time. There's no rush to feel any particular way."
          )}
        </p>
      </motion.div>

      {/* Skip option */}
      {!selectedMood && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          onClick={() => navigate('/dashboard')}
          className="mt-6 text-gray-500 hover:text-gray-700 underline text-sm"
        >
          Skip for now
        </motion.button>
      )}
    </div>
  );
};

export default LandingScreen;
