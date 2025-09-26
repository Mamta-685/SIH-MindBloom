# MindBloom Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: GitHub (Recommended)
1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/download/win
   - Or install via: `winget install Git.Git`

2. **Initialize Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MindBloom mental wellness app"
   ```

3. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name: `mindbloom` or `sih-mindbloom`
   - Make it public for hackathon demo
   - Don't initialize with README (we already have one)

4. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/mindbloom.git
   git branch -M main
   git push -u origin main
   ```

### Option 2: Vercel (Easiest)
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Choose "Yes" for all questions
   - Your app will be live in minutes!

### Option 3: Netlify
1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   - Go to https://netlify.com
   - Drag and drop the `dist` folder
   - Your app is live!

### Option 4: Firebase Hosting
1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## 📁 What to Include in Repository

### Essential Files:
- ✅ `src/` - All source code
- ✅ `public/` - Static assets
- ✅ `package.json` - Dependencies
- ✅ `vite.config.js` - Build configuration
- ✅ `tailwind.config.js` - Styling configuration
- ✅ `README.md` - Documentation
- ✅ `DEMO_SCRIPT.md` - Presentation guide
- ✅ `.gitignore` - Git ignore rules

### Files to Exclude:
- ❌ `node_modules/` - Dependencies (will be reinstalled)
- ❌ `dist/` - Build output (will be regenerated)
- ❌ `.env` - Environment variables (if any)

## 🔧 Pre-Deployment Checklist

- [ ] App runs locally (`npm run dev`)
- [ ] All features work (mood check-in, breathing, journal, etc.)
- [ ] Firebase config has placeholder values
- [ ] README has setup instructions
- [ ] Demo script is ready

## 🌐 Live Demo URLs

After deployment, you'll get URLs like:
- **Vercel**: `https://mindbloom-abc123.vercel.app`
- **Netlify**: `https://mindbloom-abc123.netlify.app`
- **Firebase**: `https://mindbloom-abc123.web.app`

## 📱 Mobile Testing

Test your deployed app on mobile:
1. Open the URL on your phone
2. Test all features (mood, breathing, journal)
3. Verify responsive design works
4. Test offline functionality

## 🎯 Hackathon Demo Tips

1. **Have backup screenshots** ready
2. **Test the live URL** before presentation
3. **Prepare for questions** about:
   - Firebase integration
   - Offline functionality
   - Accessibility features
   - Student mental health impact

## 🆘 Troubleshooting

**If deployment fails:**
- Check `package.json` has correct scripts
- Ensure all dependencies are listed
- Verify build works locally (`npm run build`)

**If app doesn't load:**
- Check console for errors
- Verify all file paths are correct
- Test with different browsers

---

**Ready to deploy? Choose your preferred method above!** 🚀
