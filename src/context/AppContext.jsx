import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCurrentUser, onAuthStateChanged } from '../utils/persistence';

const AppContext = createContext();

const initialState = {
  user: null,
  userName: 'Guest',
  currentMood: null,
  progress: {
    treeLevel: 0,
    leavesCount: 0,
    completedActivities: [],
    lastUpdated: new Date().toISOString()
  },
  settings: {
    theme: 'auto', // auto, light, dark, night
    dyslexiaFont: false,
    highContrast: false,
    language: 'en'
  },
  isLoading: true,
  isOnline: navigator.onLine
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        userName: action.payload?.displayName || action.payload?.email?.split('@')[0] || 'Guest'
      };
    
    case 'SET_USER_NAME':
      return {
        ...state,
        userName: action.payload
      };
    
    case 'SET_CURRENT_MOOD':
      return {
        ...state,
        currentMood: action.payload
      };
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: {
          ...state.progress,
          ...action.payload,
          lastUpdated: new Date().toISOString()
        }
      };
    
    case 'ADD_LEAF':
      return {
        ...state,
        progress: {
          ...state.progress,
          leavesCount: state.progress.leavesCount + 1,
          lastUpdated: new Date().toISOString()
        }
      };
    
    case 'COMPLETE_ACTIVITY':
      return {
        ...state,
        progress: {
          ...state.progress,
          completedActivities: [...state.progress.completedActivities, action.payload],
          lastUpdated: new Date().toISOString()
        }
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };
    
    case 'RESET_APP':
      return {
        ...initialState,
        settings: state.settings, // Preserve settings
        isLoading: false
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mindbloom_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('mindbloom_settings', JSON.stringify(state.settings));
  }, [state.settings]);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return unsubscribe;
  }, []);

  // Set up online/offline listeners
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    const { theme, highContrast } = state.settings;
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('morning', 'afternoon', 'evening', 'night', 'high-contrast');
    
    if (highContrast) {
      body.classList.add('high-contrast');
    } else if (theme === 'auto') {
      // Auto theme based on time of day
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        body.classList.add('morning');
      } else if (hour >= 12 && hour < 18) {
        body.classList.add('afternoon');
      } else if (hour >= 18 && hour < 22) {
        body.classList.add('evening');
      } else {
        body.classList.add('night');
      }
    } else if (theme !== 'light') {
      body.classList.add(theme);
    }
  }, [state.settings.theme, state.settings.highContrast]);

  // Apply dyslexia font
  useEffect(() => {
    const body = document.body;
    if (state.settings.dyslexiaFont) {
      body.classList.add('dyslexia-font');
    } else {
      body.classList.remove('dyslexia-font');
    }
  }, [state.settings.dyslexiaFont]);

  const value = {
    ...state,
    dispatch,
    // Helper functions
    setUserName: (name) => dispatch({ type: 'SET_USER_NAME', payload: name }),
    setCurrentMood: (mood) => dispatch({ type: 'SET_CURRENT_MOOD', payload: mood }),
    updateProgress: (progress) => dispatch({ type: 'UPDATE_PROGRESS', payload: progress }),
    addLeaf: () => dispatch({ type: 'ADD_LEAF' }),
    completeActivity: (activity) => dispatch({ type: 'COMPLETE_ACTIVITY', payload: activity }),
    updateSettings: (settings) => dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    resetApp: () => dispatch({ type: 'RESET_APP' })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
