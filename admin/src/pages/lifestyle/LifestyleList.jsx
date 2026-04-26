import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEdit2, FiHeart, FiMessageCircle } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './LifestyleList.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
};

const LifestyleList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchData = async () => {
    try {
      const [postsRes, highlightsRes] = await Promise.all([
        api.get('/lifestyle/posts'),
        api.get('/lifestyle/highlights')
      ]);
      setPosts(postsRes.data.data);
      setHighlights(highlightsRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch lifestyle data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDeletePost = async (id) => {
    if (window.confirm('Remove this post?')) {
      try {
        await api.delete(`/lifestyle/posts/${id}`);
        toast.success('Post removed');
        setPosts(posts.filter(p => p.id !== id));
      } catch (error) {
        toast.error('Failed to remove post');
      }
    }
  };

  const handleDeleteHighlight = async (id) => {
    if (window.confirm('Remove this highlight?')) {
      try {
        await api.delete(`/lifestyle/highlights/${id}`);
        toast.success('Highlight removed');
        setHighlights(highlights.filter(h => h.id !== id));
      } catch (error) {
        toast.error('Failed to remove highlight');
      }
    }
  };

  return (
    <div className="lifestyle-admin page-fade">
      <div className="page-header">
        <div className="header-info">
          <h1 className="gradient-text">Lifestyle Feed</h1>
          <p className="subtitle">Manage your Instagram-style posts, highlights, and engagement.</p>
        </div>
        <div className="header-actions">
          {activeTab === 'posts' ? (
            <button className="add-btn" onClick={() => navigate('/lifestyle/add')}>
              <FiPlus /> New Post
            </button>
          ) : (
            <button className="add-btn" onClick={() => navigate('/lifestyle/add-highlight')}>
              <FiPlus /> New Highlight
            </button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
          Posts ({posts.length})
        </button>
        <button className={`admin-tab ${activeTab === 'highlights' ? 'active' : ''}`} onClick={() => setActiveTab('highlights')}>
          Highlights ({highlights.length})
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="posts-container">
          {loading ? (
            <div className="loading-state">Loading posts...</div>
          ) : posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-card glass">
                  <div className="post-media">
                    {post.media_type === 'video' ? (
                      <video src={getMediaUrl(post.media_url)} />
                    ) : (
                      <img src={getMediaUrl(post.media_url)} alt={post.caption} />
                    )}
                    <div className="post-overlay">
                      <button className="post-action" onClick={() => navigate(`/lifestyle/edit/${post.id}`)}>
                        <FiEdit2 />
                      </button>
                      <button className="post-action delete" onClick={() => handleDeletePost(post.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="post-details">
                    <div className="post-meta">
                      <span className="post-likes"><FiHeart /> {post.likes || 0}</span>
                      <span className="post-likes"><FiMessageCircle /> {post.comments || 0}</span>
                      <span className="post-type">{post.is_reel ? 'Reel' : post.media_type}</span>
                    </div>
                    <p className="post-caption">{post.caption}</p>
                    {post.location && <p className="post-location">📍 {post.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No lifestyle posts found. Click "New Post" to add one.</div>
          )}
        </div>
      )}

      {/* Highlights Tab */}
      {activeTab === 'highlights' && (
        <div className="posts-container">
          {highlights.length > 0 ? (
            <div className="highlights-grid">
              {highlights.map((hl) => (
                <div key={hl.id} className="highlight-card glass">
                  <div className="highlight-media">
                    {hl.media_type === 'video' ? (
                      <video src={getMediaUrl(hl.cover_image)} />
                    ) : (
                      <img src={getMediaUrl(hl.cover_image)} alt={hl.title} />
                    )}
                    <div className="post-overlay">
                      <button className="post-action" onClick={() => navigate(`/lifestyle/edit-highlight/${hl.id}`)}>
                        <FiEdit2 />
                      </button>
                      <button className="post-action delete" onClick={() => handleDeleteHighlight(hl.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <div className="highlight-info">
                    <span className="highlight-title">{hl.title}</span>
                    <span className="post-type">{hl.media_type}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No highlights found. Click "New Highlight" to add one.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LifestyleList;
