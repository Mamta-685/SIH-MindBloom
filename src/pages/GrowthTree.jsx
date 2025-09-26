import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { getProgress } from '../utils/persistence';

const GrowthTree = () => {
  const { progress, addLeaf } = useApp();
  const [treeData, setTreeData] = useState(progress);
  const [isLoading, setIsLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const userProgress = await getProgress('guest');
      setTreeData(userProgress);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTreeLevel = (leavesCount) => {
    if (leavesCount < 5) return 0;
    if (leavesCount < 15) return 1;
    if (leavesCount < 30) return 2;
    if (leavesCount < 50) return 3;
    return 4;
  };

  const getTreeSize = (level) => {
    const sizes = {
      0: { trunk: 'w-8 h-16', crown: 'w-20 h-20' },
      1: { trunk: 'w-10 h-20', crown: 'w-24 h-24' },
      2: { trunk: 'w-12 h-24', crown: 'w-28 h-28' },
      3: { trunk: 'w-14 h-28', crown: 'w-32 h-32' },
      4: { trunk: 'w-16 h-32', crown: 'w-36 h-36' }
    };
    return sizes[level] || sizes[0];
  };

  const getLeavesPositions = (leavesCount, level) => {
    const positions = [];
    const maxLeaves = Math.min(leavesCount, 20); // Limit visible leaves for performance
    const size = getTreeSize(level);
    const radius = parseInt(size.crown.split('w-')[1].split(' ')[0]) / 2;
    
    for (let i = 0; i < maxLeaves; i++) {
      const angle = (i / maxLeaves) * 2 * Math.PI;
      const distance = radius * (0.3 + Math.random() * 0.4);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      positions.push({
        x: x + radius,
        y: y + radius,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5
      });
    }
    
    return positions;
  };

  const getAchievements = () => {
    const achievements = [];
    const { leavesCount, completedActivities } = treeData;
    
    if (leavesCount >= 1) {
      achievements.push({ 
        title: 'First Leaf', 
        description: 'You planted your first seed of growth!',
        emoji: '🌱',
        unlocked: true
      });
    }
    
    if (leavesCount >= 5) {
      achievements.push({ 
        title: 'Growing Strong', 
        description: 'Your tree is starting to flourish!',
        emoji: '🌿',
        unlocked: true
      });
    }
    
    if (leavesCount >= 15) {
      achievements.push({ 
        title: 'Branching Out', 
        description: 'Your growth is branching in many directions!',
        emoji: '🌳',
        unlocked: true
      });
    }
    
    if (completedActivities.includes('breathing_exercise')) {
      achievements.push({ 
        title: 'Mindful Breather', 
        description: 'You completed your first breathing exercise!',
        emoji: '🌬️',
        unlocked: true
      });
    }
    
    if (completedActivities.includes('journal_entry')) {
      achievements.push({ 
        title: 'Reflective Writer', 
        description: 'You started your journaling journey!',
        emoji: '📝',
        unlocked: true
      });
    }
    
    if (completedActivities.includes('supportive_post')) {
      achievements.push({ 
        title: 'Supportive Soul', 
        description: 'You shared support with others!',
        emoji: '💙',
        unlocked: true
      });
    }
    
    return achievements;
  };

  const handleAddLeaf = () => {
    addLeaf();
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-500"></div>
      </div>
    );
  }

  const currentLevel = getTreeLevel(treeData.leavesCount);
  const treeSize = getTreeSize(currentLevel);
  const leavesPositions = getLeavesPositions(treeData.leavesCount, currentLevel);
  const achievements = getAchievements();

  return (
    <div className="min-h-screen px-4 py-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Growth Tree</h1>
        <p className="text-gray-600">Watch your progress bloom into something beautiful</p>
      </motion.div>

      {/* Tree Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-mint-600">{treeData.leavesCount}</div>
            <div className="text-sm text-gray-600">Leaves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-lavender-600">{currentLevel}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-peach-600">{treeData.completedActivities.length}</div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
        </div>
      </motion.div>

      {/* Tree Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mb-6"
      >
        <div className="flex justify-center">
          <div className="relative">
            {/* Tree Crown */}
            <div className={`${treeSize.crown} bg-gradient-to-br from-green-400 to-green-600 rounded-full relative overflow-hidden`}>
              {/* Leaves */}
              {leavesPositions.map((leaf, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: leaf.scale, rotate: leaf.rotation }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="absolute text-green-500 text-lg"
                  style={{
                    left: `${leaf.x}px`,
                    top: `${leaf.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  🍃
                </motion.div>
              ))}
            </div>
            
            {/* Tree Trunk */}
            <div className={`${treeSize.trunk} bg-gradient-to-t from-amber-700 to-amber-500 rounded-full mx-auto`}></div>
            
            {/* Tree Base */}
            <div className="w-20 h-4 bg-amber-800 rounded-full mx-auto -mt-2"></div>
          </div>
        </div>

        {/* Celebration Effect */}
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-6xl">🎉</div>
          </motion.div>
        )}
      </motion.div>

      {/* Add Leaf Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <button
          onClick={handleAddLeaf}
          className="btn-primary text-lg px-8 py-4"
        >
          Add a Leaf 🌿
        </button>
        <p className="text-sm text-gray-600 mt-2">
          Complete activities to grow your tree naturally
        </p>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">Progress to Next Level</h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-mint-400 to-lavender-400 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((treeData.leavesCount % 15) / 15) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {15 - (treeData.leavesCount % 15)} more leaves to reach level {currentLevel + 1}
        </p>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg text-center ${
                achievement.unlocked 
                  ? 'bg-gradient-to-br from-mint-100 to-lavender-100 border border-mint-200' 
                  : 'bg-gray-100'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.emoji}</div>
              <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
              <p className="text-xs text-gray-600">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Growth Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mt-6"
      >
        <h3 className="text-lg font-semibold mb-4">How to Grow Your Tree</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌬️</span>
            <span>Complete breathing exercises</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl">📝</span>
            <span>Write in your journal</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl">💬</span>
            <span>Share support with others</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl">😊</span>
            <span>Check in with your mood</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GrowthTree;
