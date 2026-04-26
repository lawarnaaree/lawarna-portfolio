import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import '../projects/AddProject.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const EditLifestyle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    caption: '',
    location: '',
    media_type: 'image',
    is_reel: false
  });
  const [existingMedia, setExistingMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/lifestyle/posts/${id}`);
        const post = response.data.data;
        setFormData({
          caption: post.caption || '',
          location: post.location || '',
          media_type: post.media_type || 'image',
          is_reel: !!post.is_reel
        });
        setExistingMedia(post.media_url);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load post');
        navigate('/lifestyle');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, media_type: 'video' }));
      }
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    if (mediaFile) data.append('media', mediaFile);
    data.append('caption', formData.caption);
    data.append('location', formData.location);
    data.append('media_type', formData.media_type);
    data.append('is_reel', formData.is_reel);

    try {
      await api.put(`/lifestyle/posts/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Post updated successfully!');
      navigate('/lifestyle');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="add-project-page page-fade"><div className="loading-state">Loading...</div></div>;

  const displayMedia = mediaPreview || getMediaUrl(existingMedia);

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/lifestyle')}>
          <FiArrowLeft /> Back to Feed
        </button>
        <h1 className="gradient-text">Edit Post</h1>
      </div>

      <form className="project-form glass" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h3>Post Details</h3>
            <div className="input-group">
              <label>Caption</label>
              <textarea 
                name="caption" 
                placeholder="Write a caption..." 
                value={formData.caption}
                onChange={handleChange}
                rows="4"
              />
            </div>
            <div className="input-group">
              <label>Location</label>
              <input 
                type="text" 
                name="location" 
                placeholder="e.g., Kathmandu, Nepal" 
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Media</h3>
            <div className="input-group">
              <label>Current Media (click to replace)</label>
              <div className="file-upload-container">
                {displayMedia ? (
                  <div className="preview-box">
                    {formData.media_type === 'video' ? (
                      <video src={displayMedia} style={{ width: '100%', borderRadius: '12px' }} controls />
                    ) : (
                      <img src={displayMedia} alt="Preview" />
                    )}
                    <label className="remove-img" style={{ cursor: 'pointer' }}>
                      <input type="file" accept="image/*,video/*" onChange={handleMediaChange} hidden />
                      ↻
                    </label>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input type="file" accept="image/*,video/*" onChange={handleMediaChange} hidden />
                    <FiUpload className="upload-icon" />
                    <span>Click to upload</span>
                  </label>
                )}
              </div>
            </div>
            <div className="input-group">
              <label>Media Type</label>
              <select name="media_type" value={formData.media_type} onChange={handleChange}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div className="form-section full-width">
            <h3>Options</h3>
            <div className="checkbox-row">
              <div className="checkbox-group">
                <label className="switch">
                  <input type="checkbox" name="is_reel" checked={formData.is_reel} onChange={handleChange} />
                  <span className="slider"></span>
                </label>
                <span>Mark as Reel / Short Video</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/lifestyle')}>Cancel</button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLifestyle;
