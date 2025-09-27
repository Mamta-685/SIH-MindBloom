import React from "react";
import "./Dashboard.css";
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Dashboard = () => {

  const { currentMood } = useApp(); // get selected mood
  const emoji = currentMood?.emoji || "😊"; // default
  const label = currentMood?.label || "Happy";
  const dashboardItems = [
    {path: '/breathing', icon: '🌬️', label: 'Breathe', description: 'Take a mindful moment'},
    {path: '/journel', icon: '📝', label: 'Journal', description: 'Express your thoughts'},
    {path: '/connect', icon: '💬', label: 'Connect', description: 'Share with others'}
  ]



  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>Welcome back, Student!</h1>
      </header>

      {/* Current Mood */}
      <section className="card mood-section">
        <h2>Today's Mood</h2>
        <div className="mood-circle">{emoji}</div>
      <p className="mood-text">{label}</p>
      </section>

      {/* Growth Tree */}
      <section className="card tree-section">
        <div className="tree-header">
          <h2>Your Growth Tree</h2>
          <button className="tree-link">View Full Tree</button>
        </div>
        <div className="tree-visual">
          <div className="tree-trunk"></div>
          <div className="tree-leaves"></div>
        </div>
        <p className="tree-progress">5 leaves grown • Level 2</p>
      </section>

      {/* Quick Actions */}
      <section className="actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
        {
          dashboardItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
              <Link key={item.path} to={item.path} className={`action-card ${item.label.toLowerCase()} ${isActive ? "active" : ""}`}>
              <span className="icon">{item.icon}</span>

              <div>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </Link>
             );
          })
        }
        </div>

      </section>

      {/* Recent Moods */}
      <section className="card recent-moods">
        
      </section>
    </div>
  );
};

export default Dashboard;
