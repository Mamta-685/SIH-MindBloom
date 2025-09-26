// Firebase Configuration
// Replace the placeholder values below with your actual Firebase project configuration
// You can find these values in your Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
  // TODO: Replace with your Firebase project configuration
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "your-api-key-here" && 
         firebaseConfig.projectId !== "your-project-id";
};

export { firebaseConfig, isFirebaseConfigured };

// Instructions for setting up Firebase:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Go to Project Settings > General > Your apps
// 4. Click "Add app" and select Web app
// 5. Copy the configuration object and replace the values above
// 6. Enable Authentication in the Firebase Console:
//    - Go to Authentication > Sign-in method
//    - Enable Google and Email/Password providers
// 7. Enable Firestore Database:
//    - Go to Firestore Database
//    - Click "Create database"
//    - Choose "Start in test mode" for development
// 8. Update the security rules if needed for production
