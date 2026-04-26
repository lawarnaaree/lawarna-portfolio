import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiGrid, 
  FiBriefcase, 
  FiMap, 
  FiInstagram, 
  FiMessageSquare, 
  FiSettings, 
  FiLogOut 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();
  const menuItems = [
    { path: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/projects', icon: <FiBriefcase />, label: 'Projects' },
    { path: '/journey', icon: <FiMap />, label: 'Journey' },
    { path: '/lifestyle', icon: <FiInstagram />, label: 'Lifestyle' },
    { path: '/messages', icon: <FiMessageSquare />, label: 'Messages' },
    { path: '/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-accent">L</span>awarna
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
