# MindBloom - Student Mental Wellness Web App

A calm, empathetic mental-health companion for students built with React, Tailwind CSS, and Firebase. MindBloom helps students cultivate mindfulness, emotional awareness, and personal growth through mood tracking, breathing exercises, journaling, and community support.

## 🌱 Features

### Core Functionality
- **Mood Check-in**: Emoji-based mood selection with empathetic responses
- **Breathing Exercise**: 2-minute guided breathing with animated circle and timer
- **Journal**: Rich text journaling with sentiment analysis and empathetic feedback
- **Connect Board**: Anonymous supportive message sharing
- **Growth Tree**: Visual progress tracking with leaf animations
- **Settings**: Theme customization, dyslexia-friendly fonts, and user preferences

### Technical Features
- **Responsive Design**: Mobile-first approach with beautiful pastel gradients
- **Firebase Integration**: Real-time data sync with localStorage fallback
- **Sentiment Analysis**: Client-side emotion detection using the `sentiment` library
- **Accessibility**: High contrast mode, dyslexia-friendly fonts, keyboard navigation
- **Offline Support**: Works without internet using localStorage
- **Progressive Web App**: Installable and works offline

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (optional, for data sync)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd sih-mindbloom
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

The app will work immediately with localStorage - no Firebase setup required!

## 🔥 Firebase Setup (Optional)

To enable data synchronization across devices:

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard

### 2. Enable Authentication
1. Go to Authentication > Sign-in method
2. Enable Google and Email/Password providers

### 3. Enable Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" for development

### 4. Get Configuration
1. Go to Project Settings > General > Your apps
2. Click "Add app" and select Web app
3. Copy the configuration object

### 5. Update Configuration
Replace the placeholder values in `src/firebaseConfig.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

## 📱 Usage

### Landing Screen
- Enter your name (optional)
- Select your current mood using emoji buttons
- Get personalized empathetic responses

### Dashboard
- View your current mood and recent mood history
- See your growth tree progress
- Quick access to all features

### Breathing Exercise
- 2-minute guided breathing session
- Animated circle follows inhale/exhale rhythm
- Optional audio cues (add `calm-breath.mp3` to `public/sounds/`)
- Earn leaves for your growth tree

### Journal
- Write about your thoughts and feelings
- Automatic sentiment analysis (Positive/Neutral/Negative)
- Receive empathetic responses based on sentiment
- Tag entries for organization
- View all entries in chronological order

### Connect Board
- Share anonymous supportive messages
- Read encouraging posts from others
- Filter by recent or supportive content
- Contribute to a positive community

### Growth Tree
- Visual representation of your progress
- Earn leaves for completing activities
- Unlock achievements
- Track your wellness journey

### Settings
- Customize your display name
- Choose theme (auto, light, dark, night)
- Toggle dyslexia-friendly fonts
- Enable high contrast mode
- Sign in for data sync (optional)
- Reset all data if needed

## 🎨 Customization

### Themes
The app includes time-based adaptive themes:
- **Morning**: Light mint and lavender
- **Afternoon**: Brighter pastels
- **Evening**: Warmer tones
- **Night**: Dark mode with purple/indigo

### Adding Audio
1. Add your audio file to `public/sounds/calm-breath.mp3`
2. The breathing exercise will automatically use it
3. Ensure the audio is 2+ minutes for full sessions

### Sentiment Analysis
The app uses the `sentiment` library for emotion detection. You can customize responses in `src/pages/Journal.jsx`:

```javascript
const getEmpatheticMessage = (sentiment) => {
  // Add your custom messages here
};
```

## 🧪 Testing

### Manual Testing
1. **Mood Check-in**: Select different moods and verify they're saved
2. **Breathing Exercise**: Complete a full 2-minute session
3. **Journal**: Write entries with different sentiments
4. **Connect Board**: Post and read messages
5. **Growth Tree**: Verify leaves are added after activities
6. **Settings**: Test theme changes and font toggles

### Offline Testing
1. Disconnect from internet
2. Verify all features work with localStorage
3. Reconnect and check if Firebase sync works

## 📦 Dependencies

### Core
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling framework
- **Framer Motion**: Animations

### Features
- **React Router**: Navigation
- **Firebase**: Authentication and database
- **Recharts**: Data visualization
- **Sentiment**: Emotion analysis

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🎯 Demo Script

### 2-Minute Demo Flow

1. **Landing (15 seconds)**
   - "Welcome to MindBloom, a mental wellness app for students"
   - Enter name and select mood
   - Show empathetic response

2. **Dashboard (20 seconds)**
   - "Here's your personalized dashboard"
   - Show mood display and growth tree
   - "Each activity helps your tree grow"

3. **Breathing Exercise (30 seconds)**
   - "Let's try a breathing exercise"
   - Start the 2-minute timer
   - Show animated circle and instructions
   - "This helps reduce stress and anxiety"

4. **Journal (25 seconds)**
   - "Write about your feelings"
   - Create a journal entry
   - Show sentiment analysis and empathetic response
   - "The app understands your emotions and responds supportively"

5. **Connect Board (20 seconds)**
   - "Share support with other students"
   - Show anonymous posts
   - "Build a supportive community"

6. **Growth Tree (10 seconds)**
   - "Watch your progress bloom"
   - Show leaves added from activities
   - "Every positive action grows your tree"

### Key Talking Points
- "No forced signup - works immediately"
- "Data stays private and secure"
- "Works offline with localStorage"
- "Firebase syncs across devices"
- "Accessible for all students"

## 🔧 Troubleshooting

### Common Issues

**App won't start:**
- Check Node.js version (v16+)
- Delete `node_modules` and run `npm install`
- Clear browser cache

**Firebase errors:**
- Verify configuration in `firebaseConfig.js`
- Check Firebase project settings
- Ensure Authentication and Firestore are enabled

**Animations not working:**
- Check if Framer Motion is installed
- Verify browser supports CSS animations

**Sentiment analysis not working:**
- Ensure `sentiment` package is installed
- Check browser console for errors

### Getting Help
- Check browser console for error messages
- Verify all dependencies are installed
- Test with localStorage-only mode first

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💚 Support

Made with 💚 for student mental health. If you find this helpful, please consider:
- Starring the repository
- Sharing with other students
- Contributing improvements
- Reporting issues

---

**Remember**: This app is designed to support mental wellness, not replace professional help. If you're struggling with mental health, please reach out to a counselor or mental health professional.