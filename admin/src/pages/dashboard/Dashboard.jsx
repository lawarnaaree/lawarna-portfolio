import React from 'react';
import { FiUsers, FiEye, FiMessageSquare, FiBriefcase } from 'react-icons/fi';
import './Dashboard.css';

const StatCard = ({ icon, label, value, trend, trendValue }) => (
  <div className="stat-card glass">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <h3 className="stat-value">{value}</h3>
      <div className={`stat-trend ${trend}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}% 
        <span className="trend-text">vs last month</span>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = [
    { icon: <FiEye />, label: 'Total Views', value: '12.4k', trend: 'up', trendValue: '12' },
    { icon: <FiBriefcase />, label: 'Projects', value: '24', trend: 'up', trendValue: '2' },
    { icon: <FiMessageSquare />, label: 'Inquiries', value: '48', trend: 'down', trendValue: '5' },
    { icon: <FiUsers />, label: 'Visitors', value: '1.2k', trend: 'up', trendValue: '8' },
  ];

  return (
    <div className="dashboard-page page-fade">
      <div className="dashboard-header">
        <h1 className="gradient-text">Dashboard</h1>
        <p className="subtitle">Overview of your portfolio's performance and activity.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="section-main glass">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <button className="view-all">View All</button>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-text">New project <strong>"Modern E-commerce"</strong> added to portfolio.</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-text">Received a new inquiry from <strong>John Doe</strong> via contact form.</p>
                <span className="activity-time">5 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div className="activity-content">
                <p className="activity-text">Lifestyle post updated with a new reel.</p>
                <span className="activity-time">Yesterday</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-side glass">
          <div className="section-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <button className="action-btn primary">Add New Project</button>
            <button className="action-btn">Update Biography</button>
            <button className="action-btn">Manage Highlights</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
