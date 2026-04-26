import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiBriefcase, FiBookOpen, FiAward } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './JourneyList.css';

const JourneyList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJourney = async () => {
    try {
      const response = await api.get('/journey');
      setEntries(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch journey entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJourney();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete entry "${title}"?`)) {
      try {
        await api.delete(`/journey/${id}`);
        toast.success('Entry deleted');
        setEntries(entries.filter(e => e.id !== id));
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete entry');
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'education': return <FiBookOpen />;
      case 'award': return <FiAward />;
      default: return <FiBriefcase />;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="journey-page page-fade">
      <div className="page-header">
        <div className="header-info">
          <h1 className="gradient-text">My Journey</h1>
          <p className="subtitle">Manage your experience, education, and milestones.</p>
        </div>
        <button className="add-btn" onClick={() => navigate('/journey/add')}>
          <FiPlus /> Add Entry
        </button>
      </div>

      <div className="journey-list-container">
        {loading ? (
          <div className="loading-state">Loading journey...</div>
        ) : entries.length > 0 ? (
          <div className="journey-grid">
            {entries.map((entry) => (
              <div key={entry.id} className="journey-card glass">
                <div className="journey-card-header">
                  <div className={`journey-type-badge ${entry.type}`}>
                    {getTypeIcon(entry.type)}
                    <span>{entry.type}</span>
                  </div>
                  <div className="journey-date">
                    <FiCalendar /> 
                    {formatDate(entry.start_date)} — {entry.is_current ? 'Present' : formatDate(entry.end_date)}
                  </div>
                </div>
                <h3 className="journey-card-title">{entry.role}</h3>
                <h4 className="journey-card-subtitle">{entry.company} • {entry.title}</h4>
                <p className="journey-card-desc">{entry.description}</p>
                <div className="journey-card-actions">
                  <button className="icon-btn" onClick={() => navigate(`/journey/edit/${entry.id}`)} title="Edit">
                    <FiEdit2 />
                  </button>
                  <button 
                    className="icon-btn delete" 
                    title="Delete"
                    onClick={() => handleDelete(entry.id, entry.title)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No journey entries found.</div>
        )}
      </div>
    </div>
  );
};

export default JourneyList;
