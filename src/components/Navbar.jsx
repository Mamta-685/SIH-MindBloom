import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { userName, isOnline } = useApp();

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/breathing', icon: '🌬️', label: 'Breathe' },
    { path: '/journal', icon: '📝', label: 'Journal' },
    { path: '/connect', icon: '💬', label: 'Connect' },
    { path: '/growth', icon: '🌱', label: 'Growth' },
    { path: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  // Don't show navbar on landing screen
  if (location.pathname === '/') {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed-bottom navbar navbar-expand-lg"
      style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 1050
      }}
    >
      <div className="container-fluid d-flex justify-content-around align-items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`d-flex flex-column align-items-center p-2 rounded-3 text-decoration-none transition-all ${
                isActive
                  ? 'btn-primary'
                  : 'text-muted'
              }`}
              style={{ 
                transition: 'all 0.2s',
                borderRadius: '12px'
              }}
            >
              <span className="fs-4 mb-1">{item.icon}</span>
              <span className="small fw-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      {/* Online/Offline indicator */}
      <div className="position-absolute top-0 end-0 m-2">
        <div 
          className={`rounded-circle ${isOnline ? 'bg-success' : 'bg-danger'}`}
          style={{ width: '8px', height: '8px' }}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
