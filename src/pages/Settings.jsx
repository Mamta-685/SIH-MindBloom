import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { signInWithGoogle, signInWithEmail, createUserWithEmailAndPassword, signOutUser, getCurrentUser } from '../utils/persistence';

const Settings = () => {
  const { 
    userName, 
    setUserName, 
    settings, 
    updateSettings, 
    resetApp,
    user 
  } = useApp();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // signin, signup
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'signin') {
        await signInWithEmail(authData.email, authData.password);
      } else {
        if (authData.password !== authData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await createUserWithEmailAndPassword(authData.email, authData.password);
      }
      setShowAuthModal(false);
      setAuthData({ email: '', password: '', confirmPassword: '' });
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowAuthModal(false);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your data? This cannot be undone.')) {
      resetApp();
    }
  };

  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen px-4 py-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your MindBloom experience</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
            />
          </div>

          {currentUser ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">
                ✅ Signed in as {currentUser.email}
              </p>
              <button
                onClick={handleSignOut}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 mb-3">
                Sign in to sync your data across devices
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-primary text-sm"
              >
                Sign In / Sign Up
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
            >
              <option value="auto">Auto (Time-based)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Dyslexia-friendly Font
              </label>
              <p className="text-xs text-gray-500">
                Makes text easier to read for people with dyslexia
              </p>
            </div>
            <button
              onClick={() => updateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.dyslexiaFont ? 'bg-mint-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.dyslexiaFont ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                High Contrast
              </label>
              <p className="text-xs text-gray-500">
                Increases contrast for better visibility
              </p>
            </div>
            <button
              onClick={() => updateSettings({ highContrast: !settings.highContrast })}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.highContrast ? 'bg-mint-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Language Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Language</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => updateSettings({ language: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">
              ⚠️ <strong>Reset Data:</strong> This will delete all your journal entries, mood data, and progress. This action cannot be undone.
            </p>
            <button
              onClick={handleReset}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Reset All Data
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              💾 <strong>Data Storage:</strong> Your data is stored locally in your browser. Sign in to sync across devices.
            </p>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-semibold mb-4">About MindBloom</h2>
        
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            MindBloom is a mental wellness companion designed to help students 
            cultivate mindfulness, emotional awareness, and personal growth.
          </p>
          <p>
            Version 1.0.0 • Built with React and Tailwind CSS
          </p>
          <p>
            Made with 💚 for student mental health
          </p>
        </div>
      </motion.div>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-md w-full"
          >
            <h2 className="text-xl font-semibold mb-4">
              {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={authData.confirmPassword}
                    onChange={(e) => setAuthData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                    required
                  />
                </div>
              )}

              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{authError}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? 'Loading...' : (authMode === 'signin' ? 'Sign In' : 'Sign Up')}
                </button>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>🔍</span>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="w-full text-sm text-mint-600 hover:text-mint-700"
                >
                  {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
