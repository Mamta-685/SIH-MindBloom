import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { saveProgress } from '../utils/persistence';
import './BreathingExercise.css';

const BreathingExercise = () => {
  const navigate = useNavigate();
  const { addLeaf, completeActivity, progress } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState('inhale'); 
  const [timeLeft, setTimeLeft] = useState(120); 
  const [isCompleted, setIsCompleted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [breathCount, setBreathCount] = useState(0);

  const intervalRef = useRef(null);

  const phases = {
    inhale: { duration: 4000, instruction: 'Breathe in slowly...', color: 'inhale-gradient' },
    hold: { duration: 2000, instruction: 'Hold your breath...', color: 'hold-gradient' },
    exhale: { duration: 6000, instruction: 'Breathe out gently...', color: 'exhale-gradient' },
    rest: { duration: 2000, instruction: 'Rest and relax...', color: 'rest-gradient' }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      const phaseInterval = setInterval(() => {
        setPhase(prevPhase => {
          const phaseOrder = ['inhale', 'hold', 'exhale', 'rest'];
          const currentIndex = phaseOrder.indexOf(prevPhase);
          const nextIndex = (currentIndex + 1) % phaseOrder.length;
          const nextPhase = phaseOrder[nextIndex];
          if (nextPhase === 'inhale') setBreathCount(prev => prev + 1);
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

  const handleStart = () => { setIsActive(true); setIsPaused(false); };
  const handlePause = () => { setIsPaused(!isPaused); };
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
    addLeaf();
    await completeActivity('breathing_exercise');
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
    switch (phase) {
      case 'inhale': return 1.2;
      case 'hold': return 1.2;
      case 'exhale': return 0.8;
      case 'rest': return 1;
      default: return 1;
    }
  };

  return (
    <div className="breathing-container">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="header">
        <h1>Breathing Exercise</h1>
        <p>Take a moment to center yourself</p>
      </motion.div>

      {/* Timer */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="timer-card">
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="timer-bar">
          <motion.div className="timer-progress" style={{ width: `${(timeLeft / 120) * 100}%` }} />
        </div>
        <p>{breathCount} breaths completed</p>
      </motion.div>

      {/* Breathing Circle */}
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="circle-wrapper">
        <motion.div
          className={`breathing-circle ${phases[phase].color}`}
          animate={{ scale: getCircleSize() }}
          transition={{ duration: phases[phase].duration / 1000 }}
        >
          <div className="circle-content">
            <div className="emoji">🌬️</div>
            <div className="instruction">{phases[phase].instruction}</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="controls">
        {!isActive ? (
          <button onClick={handleStart} className="btn btn-start">Start Breathing</button>
        ) : (
          <>
            <button onClick={handlePause} className="btn btn-pause">{isPaused ? 'Resume' : 'Pause'}</button>
            <button onClick={handleStop} className="btn btn-stop">Stop</button>
          </>
        )}
      </motion.div>

      {/* Audio Toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="audio-toggle">
        <button onClick={() => setAudioEnabled(!audioEnabled)} className={`audio-btn ${audioEnabled ? 'on' : 'off'}`}>
          <span>{audioEnabled ? '🔊' : '🔇'}</span>
          <span>{audioEnabled ? 'Audio On' : 'Audio Off'}</span>
        </button>
      </motion.div>

      {/* Instructions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="instructions-card">
        <h3>How to Breathe</h3>
        <ul>
          <li>Find a comfortable position</li>
          <li>Follow the circle's rhythm</li>
          <li>Breathe naturally and gently</li>
          <li>Focus on the present moment</li>
        </ul>
      </motion.div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-backdrop">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="modal-card">
              <div className="modal-emoji">🌿</div>
              <h2>Great Job!</h2>
              <p>You've completed your breathing exercise. A new leaf has grown on your tree!</p>
              <div className="modal-buttons">
                <button onClick={() => navigate('/growth')} className="btn btn-start w-full">View Your Tree</button>
                <button onClick={() => navigate('/dashboard')} className="btn btn-stop w-full">Back to Dashboard</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathingExercise;
