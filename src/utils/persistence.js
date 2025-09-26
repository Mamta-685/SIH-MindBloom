import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { firebaseConfig, isFirebaseConfigured } from '../firebaseConfig';

// Initialize Firebase
let app, db, auth;
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization failed, falling back to localStorage:', error);
  }
}

// LocalStorage fallback functions
const getLocalStorageKey = (key) => `mindbloom_${key}`;

const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(getLocalStorageKey(key), JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

const getFromLocalStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(getLocalStorageKey(key));
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return defaultValue;
  }
};

// Firebase operations with localStorage fallback
const saveToFirestore = async (collectionName, data) => {
  if (!db) throw new Error('Firebase not configured');
  
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Firestore save failed:', error);
    throw error;
  }
};

const getFromFirestore = async (collectionName, orderByField = 'createdAt', orderDirection = 'desc') => {
  if (!db) throw new Error('Firebase not configured');
  
  try {
    const q = query(collection(db, collectionName), orderBy(orderByField, orderDirection));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Firestore read failed:', error);
    throw error;
  }
};

// Mood persistence
export const saveMood = async (moodData) => {
  const data = {
    mood: moodData.mood,
    date: moodData.date || new Date().toISOString(),
    userId: moodData.userId || 'guest'
  };

  if (db && auth?.currentUser) {
    try {
      return await saveToFirestore('moods', data);
    } catch (error) {
      console.warn('Firebase save failed, using localStorage:', error);
    }
  }
  
  const moods = getFromLocalStorage('moods');
  const newMood = { id: Date.now().toString(), ...data };
  moods.unshift(newMood);
  saveToLocalStorage('moods', moods);
  return newMood;
};

export const getMoods = async (userId = 'guest') => {
  if (db && auth?.currentUser) {
    try {
      const moods = await getFromFirestore('moods');
      return moods.filter(mood => mood.userId === userId);
    } catch (error) {
      console.warn('Firebase read failed, using localStorage:', error);
    }
  }
  
  const moods = getFromLocalStorage('moods');
  return moods.filter(mood => mood.userId === userId);
};

// Journal persistence
export const saveJournalEntry = async (entryData) => {
  const data = {
    title: entryData.title || 'Untitled',
    content: entryData.content,
    mood: entryData.mood,
    tags: entryData.tags || [],
    sentiment: entryData.sentiment,
    userId: entryData.userId || 'guest'
  };

  if (db && auth?.currentUser) {
    try {
      return await saveToFirestore('journalEntries', data);
    } catch (error) {
      console.warn('Firebase save failed, using localStorage:', error);
    }
  }
  
  const entries = getFromLocalStorage('journalEntries');
  const newEntry = { id: Date.now().toString(), ...data };
  entries.unshift(newEntry);
  saveToLocalStorage('journalEntries', entries);
  return newEntry;
};

export const getJournalEntries = async (userId = 'guest') => {
  if (db && auth?.currentUser) {
    try {
      const entries = await getFromFirestore('journalEntries');
      return entries.filter(entry => entry.userId === userId);
    } catch (error) {
      console.warn('Firebase read failed, using localStorage:', error);
    }
  }
  
  const entries = getFromLocalStorage('journalEntries');
  return entries.filter(entry => entry.userId === userId);
};

export const deleteJournalEntry = async (entryId) => {
  if (db && auth?.currentUser) {
    try {
      await deleteDoc(doc(db, 'journalEntries', entryId));
      return true;
    } catch (error) {
      console.warn('Firebase delete failed, using localStorage:', error);
    }
  }
  
  const entries = getFromLocalStorage('journalEntries');
  const filteredEntries = entries.filter(entry => entry.id !== entryId);
  return saveToLocalStorage('journalEntries', filteredEntries);
};

// Connect board persistence
export const savePost = async (postData) => {
  const data = {
    message: postData.message,
    isAnonymous: true,
    userId: 'anonymous',
    createdAt: new Date().toISOString()
  };

  if (db) {
    try {
      return await saveToFirestore('posts', data);
    } catch (error) {
      console.warn('Firebase save failed, using localStorage:', error);
    }
  }
  
  const posts = getFromLocalStorage('posts');
  const newPost = { id: Date.now().toString(), ...data };
  posts.unshift(newPost);
  saveToLocalStorage('posts', posts);
  return newPost;
};

export const getPosts = async () => {
  if (db) {
    try {
      return await getFromFirestore('posts');
    } catch (error) {
      console.warn('Firebase read failed, using localStorage:', error);
    }
  }
  
  return getFromLocalStorage('posts');
};

// Progress persistence
export const saveProgress = async (progressData) => {
  const data = {
    userId: progressData.userId || 'guest',
    treeLevel: progressData.treeLevel || 0,
    leavesCount: progressData.leavesCount || 0,
    completedActivities: progressData.completedActivities || [],
    lastUpdated: new Date().toISOString()
  };

  if (db && auth?.currentUser) {
    try {
      // For progress, we'll use a single document per user
      const progressRef = doc(db, 'userProgress', auth.currentUser.uid);
      await updateDoc(progressRef, data);
      return data;
    } catch (error) {
      console.warn('Firebase save failed, using localStorage:', error);
    }
  }
  
  const progress = getFromLocalStorage('progress', {});
  progress[data.userId] = data;
  saveToLocalStorage('progress', progress);
  return data;
};

export const getProgress = async (userId = 'guest') => {
  if (db && auth?.currentUser) {
    try {
      const progressRef = doc(db, 'userProgress', auth.currentUser.uid);
      const progressDoc = await getDocs(collection(db, 'userProgress'));
      const userProgress = progressDoc.docs.find(doc => doc.data().userId === userId);
      return userProgress ? userProgress.data() : getDefaultProgress();
    } catch (error) {
      console.warn('Firebase read failed, using localStorage:', error);
    }
  }
  
  const progress = getFromLocalStorage('progress', {});
  return progress[userId] || getDefaultProgress();
};

const getDefaultProgress = () => ({
  treeLevel: 0,
  leavesCount: 0,
  completedActivities: [],
  lastUpdated: new Date().toISOString()
});

// Authentication functions
export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase not configured');
  
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
};

export const signInWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase not configured');
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email sign-in failed:', error);
    throw error;
  }
};

export const createUserWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase not configured');
  
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('User creation failed:', error);
    throw error;
  }
};

// Export alias for compatibility
export { createUserWithEmail as createUserWithEmailAndPassword };

export const signOutUser = async () => {
  if (!auth) return;
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth?.currentUser || null;
};

export const onAuthStateChanged = (callback) => {
  if (!auth) return () => {};
  return auth.onAuthStateChanged(callback);
};
