import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiTrash2, FiEye, FiCheckCircle, FiX, FiPhone, FiCalendar, FiUser, FiTag } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const response = await api.get('/general/messages');
      setMessages(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await api.delete(`/general/messages/${id}`);
        toast.success('Message deleted');
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

  const toggleRead = async (id, currentStatus) => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    try {
      await api.put(`/general/messages/${id}`, { status: newStatus });
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m));
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/messages/${id}`);
  };

  return (
    <div className="messages-page page-fade">
      <div className="page-header">
        <h1 className="gradient-text">Messages</h1>
        <p className="subtitle">Review inquiries from your contact form.</p>
      </div>

      <div className="messages-container glass">
        {loading ? (
          <div className="loading-state">Loading messages...</div>
        ) : messages.length > 0 ? (
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-item ${msg.status === 'read' ? 'read' : 'unread'}`}>
                <div className="message-status">
                  {msg.status === 'unread' && <div className="unread-dot"></div>}
                </div>
                <div className="message-content" onClick={() => handleViewDetails(msg.id)}>
                  <div className="message-info">
                    <span className="sender-name">{msg.name}</span>
                    <span className="sender-email">{msg.email}</span>
                    <span className="message-date">{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <h4 className="message-subject">{msg.subject || 'No Subject'}</h4>
                  <p className="message-text">{msg.message}</p>
                </div>
                <div className="message-actions">
                  <button 
                    className="msg-btn view" 
                    title="View Details"
                    onClick={() => handleViewDetails(msg.id)}
                  >
                    <FiEye />
                  </button>
                  <button 
                    className="msg-btn" 
                    title={msg.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                    onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.status); }}
                  >
                    <FiCheckCircle />
                  </button>
                  <button 
                    className="msg-btn delete" 
                    title="Delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No messages yet.</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
