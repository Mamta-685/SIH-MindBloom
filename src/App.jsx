import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';

// Lazy load pages for better performance
const LandingScreen = React.lazy(() => import('./pages/LandingScreen'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BreathingExercise = React.lazy(() => import('./pages/BreathingExercise'));
const Journal = React.lazy(() => import('./pages/Journal'));
const ConnectBoard = React.lazy(() => import('./pages/ConnectBoard'));
const GrowthTree = React.lazy(() => import('./pages/GrowthTree'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<LandingScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/breathing" element={<BreathingExercise />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/connect" element={<ConnectBoard />} />
              <Route path="/growth" element={<GrowthTree />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
          <Navbar />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
