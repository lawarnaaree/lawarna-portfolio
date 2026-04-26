import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiUser, FiMail, FiPhone, FiCalendar, FiTag } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import '../projects/AddProject.css'; // Reuse consistent form/page styles

const MessageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await api.get('/general/messages');
        const found = response.data.data.find(m => m.id.toString() === id);
        
        if (!found) {
          toast.error('Message not found');
          navigate('/messages');
          return;
        }

        setMessage(found);

        // Mark as read if it was unread
        if (found.status === 'unread') {
          await api.put(`/general/messages/${id}`, { status: 'read' });
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch message details');
        navigate('/messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/general/messages/${id}`);
        toast.success('Message deleted successfully');
        navigate('/messages');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete message');
      }
    }
  };

  if (loading) return <div className="admin-content">Loading...</div>;
  if (!message) return null;

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/messages')}>
          <FiArrowLeft /> Back to Inbox
        </button>
        <h1 className="gradient-text">Message Details</h1>
      </div>

      <div className="project-form glass" style={{ padding: '40px' }}>
        <div className="form-grid">
          {/* Left Column: Sender Info */}
          <div className="form-section">
            <h3>Sender Information</h3>
            <div className="input-group">
              <label><FiUser /> Name</label>
              <div className="detail-value">{message.name}</div>
            </div>
            <div className="input-group">
              <label><FiMail /> Email</label>
              <div className="detail-value">
                <a href={`mailto:${message.email}`} className="accent-link">{message.email}</a>
              </div>
            </div>
            {message.phone && (
              <div className="input-group">
                <label><FiPhone /> Phone</label>
                <div className="detail-value">
                  <a href={`tel:${message.phone}`} className="accent-link">{message.phone}</a>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Meta Info */}
          <div className="form-section">
            <h3>Message Info</h3>
            <div className="input-group">
              <label><FiCalendar /> Received On</label>
              <div className="detail-value">{new Date(message.created_at).toLocaleString()}</div>
            </div>
            <div className="input-group">
              <label><FiTag /> Subject</label>
              <div className="detail-value highlight-text">{message.subject || 'No Subject'}</div>
            </div>
            <div className="input-group">
              <label>Status</label>
              <div className={`status-badge ${message.status}`}>
                {message.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Full Width: Content */}
          <div className="form-section full-width" style={{ marginTop: '30px' }}>
            <h3>Message Content</h3>
            <div className="message-content-box">
              {message.message}
            </div>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: '40px' }}>
          <button type="button" className="delete-btn-large" onClick={handleDelete}>
            <FiTrash2 /> Delete Message
          </button>
          <button type="button" className="save-btn" onClick={() => navigate('/messages')}>
            Close
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .detail-value {
          background: #0a0a0a;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1px solid var(--border);
          color: var(--text-main);
          font-size: 15px;
        }
        .message-content-box {
          background: #0a0a0a;
          padding: 25px;
          border-radius: 15px;
          border: 1px solid var(--border);
          color: var(--text-muted);
          line-height: 1.8;
          font-size: 16px;
          white-space: pre-wrap;
          min-height: 200px;
        }
        .accent-link {
          color: var(--primary);
          text-decoration: none;
          transition: var(--transition);
        }
        .accent-link:hover {
          text-decoration: underline;
        }
        .highlight-text {
          color: var(--primary);
          font-weight: 600;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .status-badge.read { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .status-badge.unread { background: rgba(232, 87, 42, 0.1); color: var(--primary); }
        
        .delete-btn-large {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 25px;
          color: #f87171;
          font-weight: 600;
          transition: var(--transition);
          border-radius: 12px;
        }
        .delete-btn-large:hover {
          background: rgba(248, 113, 113, 0.1);
        }
      `}} />
    </div>
  );
};

export default MessageDetail;
