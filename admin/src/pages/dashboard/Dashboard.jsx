import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMessageSquare, FiBriefcase, 
  FiHeart, FiActivity, FiArrowRight, FiPlus, FiSettings 
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../../utils/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './Dashboard.css';

dayjs.extend(relativeTime);

const StatCard = ({ icon, label, value, subLabel, onClick }) => (
  <div className="stat-card glass" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <h3 className="stat-value">{value}</h3>
      {subLabel && <div className="stat-sublabel">{subLabel}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="dashboard-page page-fade">
      <div className="loading-state">Refurbishing your dashboard...</div>
    </div>
  );

  const { stats, activity, engagement } = data;

  const chartData = engagement.map(item => ({
    name: dayjs(item.date).format('MMM D'),
    likes: item.count
  }));

  const getActivityIcon = (type) => {
    switch(type) {
      case 'project': return <FiBriefcase />;
      case 'message': return <FiMessageSquare />;
      case 'post': return <FiHeart />;
      default: return <FiActivity />;
    }
  };

  const getActivityText = (item) => {
    switch(item.type) {
      case 'project': return <>New project <strong>"{item.label}"</strong> added.</>;
      case 'message': return <>Received message from <strong>{item.label}</strong>.</>;
      case 'post': return <>Shared a new lifestyle post: <strong>"{item.label?.substring(0, 30)}..."</strong></>;
      default: return item.label;
    }
  };

  return (
    <div className="dashboard-page page-fade">
      <div className="dashboard-header">
        <h1 className="gradient-text">Welcome Back, Lawarna</h1>
        <p className="subtitle">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          icon={<FiBriefcase />} 
          label="Total Projects" 
          value={stats.projects} 
          subLabel="Portfolio growth"
          onClick={() => navigate('/projects')}
        />
        <StatCard 
          icon={<FiMessageSquare />} 
          label="Inquiries" 
          value={stats.messages.total} 
          subLabel={`${stats.messages.unread} unread messages`}
          onClick={() => navigate('/messages')}
        />
        <StatCard 
          icon={<FiHeart />} 
          label="Lifestyle Likes" 
          value={stats.lifestyle.likes} 
          subLabel={`Across ${stats.lifestyle.posts} posts`}
          onClick={() => navigate('/lifestyle')}
        />
        <StatCard 
          icon={<FiActivity />} 
          label="Career Steps" 
          value={stats.journey} 
          subLabel="Journey timeline items"
          onClick={() => navigate('/journey')}
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-container glass">
          <div className="section-header">
            <h3>Recent Engagement</h3>
            <span className="subtitle">Likes over the last 7 days</span>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-dim)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="var(--text-dim)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLikes)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-main glass">
          <div className="section-header">
            <h3>Recent Activity</h3>
            <button className="view-all" onClick={() => navigate('/messages')}>View Inquiries <FiArrowRight /></button>
          </div>
          <div className="activity-list">
            {activity.length > 0 ? activity.map((item, index) => (
              <div key={`${item.type}-${item.id}-${index}`} className="activity-item">
                <div className={`activity-icon-small ${item.type}`}>
                  {getActivityIcon(item.type)}
                </div>
                <div className="activity-content">
                  <p className="activity-text">{getActivityText(item)}</p>
                  <span className="activity-time">{dayjs(item.created_at).fromNow()}</span>
                </div>
              </div>
            )) : (
              <p className="empty-text">No recent activity to show.</p>
            )}
          </div>
        </div>

        <div className="section-side">
          <div className="side-card glass">
            <div className="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => navigate('/projects/add')}>
                <FiPlus /> New Project
              </button>
              <button className="action-btn" onClick={() => navigate('/lifestyle/add')}>
                <FiPlus /> New Lifestyle Post
              </button>
              <button className="action-btn" onClick={() => navigate('/messages')}>
                <FiMessageSquare /> Check Inbox
              </button>
              <button className="action-btn" onClick={() => navigate('/settings')}>
                <FiSettings /> Site Settings
              </button>
            </div>
          </div>

          <div className="side-card glass status-summary">
            <h3>System Status</h3>
            <div className="status-item">
              <span>Database</span>
              <span className="status-tag online">Online</span>
            </div>
            <div className="status-item">
              <span>Media Server</span>
              <span className="status-tag online">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
