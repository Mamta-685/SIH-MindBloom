import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { saveMood } from '../utils/persistence';
import './LandingScreen.css';

const LandingScreen = () => {
  const navigate = useNavigate();
  const { setCurrentMood } = useApp();
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

  // Save to backend / localStorage
  try {
    await saveMood({ mood: mood.value, userId: 'guest' });
    
    // Set full mood in context (with emoji & label)
    setCurrentMood(mood);
  } catch (error) {
    console.error('Failed to save mood:', error);
  }

  setTimeout(() => {
    navigate('/dashboard');
  }, 1000);
};


  return (
    <div className="landing-container">
      <div className={`sprout ${isAnimating ? 'sprout-animate' : ''}`}>🌱</div>

      <div className="greeting">
        <h1>You’re here, and that’s already progress 🌱. How do you feel today?</h1>
      </div>

      <div className="mood-selection">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood)}
            className={`mood-btn ${selectedMood?.value === mood.value ? 'active' : ''}`}
            disabled={isAnimating}
          >
            {mood.emoji}
          </button>
        ))}
      </div>

      <div className="encouraging-message">
        <p>
          {selectedMood ? (
            <span>
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
      </div>

      {!selectedMood && (
        <button onClick={() => navigate('/dashboard')} className="skip-btn">
          Skip for now
        </button>
      )}
    </div>
  );
};

export default LandingScreen;
