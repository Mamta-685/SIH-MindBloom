import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { saveProgress } from '../utils/persistence';

const BreathingExercise = () => {
  const navigate = useNavigate();
  const { addLeaf, completeActivity, progress } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, rest
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [breathCount, setBreathCount] = useState(0);
  
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const phases = {
    inhale: { duration: 4000, instruction: 'Breathe in slowly...', color: 'from-mint-400 to-lavender-400' },
    hold: { duration: 2000, instruction: 'Hold your breath...', color: 'from-lavender-400 to-peach-400' },
    exhale: { duration: 6000, instruction: 'Breathe out gently...', color: 'from-peach-400 to-mint-400' },
    rest: { duration: 2000, instruction: 'Rest and relax...', color: 'from-mint-300 to-lavender-300' }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      const phaseInterval = setInterval(() => {
        setPhase(prevPhase => {
          const phaseOrder = ['inhale', 'hold', 'exhale', 'rest'];
          const currentIndex = phaseOrder.indexOf(prevPhase);
          const nextIndex = (currentIndex + 1) % phaseOrder.length;
          const nextPhase = phaseOrder[nextIndex];
          
          if (nextPhase === 'inhale') {
            setBreathCount(prev => prev + 1);
          }
          
          return nextPhase;
        });
      }, phases[phase].duration);

      const timerInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      intervalRef.current = { phaseInterval, timerInterval };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current.phaseInterval);
        clearInterval(intervalRef.current.timerInterval);
      }
    };
  }, [isActive, isPaused, phase]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase('inhale');
    setTimeLeft(120);
    setBreathCount(0);
    setIsCompleted(false);
  };

  const handleComplete = async () => {
    setIsActive(false);
    setIsCompleted(true);
    
    // Add leaf and complete activity
    addLeaf();
    await completeActivity('breathing_exercise');
    
    // Save progress
    try {
      await saveProgress({
        ...progress,
        leavesCount: progress.leavesCount + 1,
        completedActivities: [...progress.completedActivities, 'breathing_exercise']
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleSize = () => {
    if (!isActive) return 1;
    
    switch (phase) {
      case 'inhale':
        return 1.2;
      case 'hold':
        return 1.2;
      case 'exhale':
        return 0.8;
      case 'rest':
        return 1;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Breathing Exercise
        </h1>
        <p className="text-gray-600">
          Take a moment to center yourself
        </p>
      </motion.div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center mb-6"
      >
        <div className="text-4xl font-bold text-mint-600 mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-mint-500 h-2 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeLeft / 120) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {breathCount} breaths completed
        </p>
      </motion.div>

      {/* Breathing Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <motion.div
          className={`w-64 h-64 rounded-full bg-gradient-to-br ${phases[phase].color} flex items-center justify-center text-white text-2xl font-bold shadow-2xl`}
          animate={{
            scale: getCircleSize(),
          }}
          transition={{
            duration: phases[phase].duration / 1000,
            ease: phase === 'inhale' ? 'easeOut' : phase === 'exhale' ? 'easeIn' : 'linear'
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-2">🌬️</div>
            <div className="text-lg font-medium">
              {phases[phase].instruction}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center space-x-4 mb-6"
      >
        {!isActive ? (
          <button
            onClick={handleStart}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Breathing
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="btn-secondary text-lg px-6 py-4"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleStop}
              className="btn-ghost text-lg px-6 py-4"
            >
              Stop
            </button>
          </>
        )}
      </motion.div>

      {/* Audio Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center mb-6"
      >
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            audioEnabled ? 'bg-mint-100 text-mint-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span className="text-xl">{audioEnabled ? '🔊' : '🔇'}</span>
          <span className="text-sm font-medium">
            {audioEnabled ? 'Audio On' : 'Audio Off'}
          </span>
        </button>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card text-center"
      >
        <h3 className="text-lg font-semibold mb-4">How to Breathe</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Find a comfortable position</p>
          <p>• Follow the circle's rhythm</p>
          <p>• Breathe naturally and gently</p>
          <p>• Focus on the present moment</p>
        </div>
      </motion.div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="card text-center max-w-sm w-full"
            >
              <div className="text-6xl mb-4">🌿</div>
              <h2 className="text-2xl font-bold text-mint-600 mb-4">
                Great Job!
              </h2>
              <p className="text-gray-600 mb-6">
                You've completed your breathing exercise. A new leaf has grown on your tree!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/growth')}
                  className="btn-primary w-full"
                >
                  View Your Tree
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-ghost w-full"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingExercise;
