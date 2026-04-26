import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import '../projects/AddProject.css';

const AddHighlight = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    media_type: 'image',
    display_order: 0
  });
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      // Detect type
      if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, media_type: 'video' }));
      } else {
        setFormData(prev => ({ ...prev, media_type: 'image' }));
      }
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile) {
      toast.error('Please upload a cover image or video');
      return;
    }
    setIsSubmitting(true);

    const data = new FormData();
    data.append('cover_image', mediaFile);
    data.append('title', formData.title);
    data.append('media_type', formData.media_type);
    data.append('display_order', formData.display_order);

    try {
      await api.post('/lifestyle/highlights', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Highlight created successfully!');
      navigate('/lifestyle');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create highlight');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/lifestyle')}>
          <FiArrowLeft /> Back to Feed
        </button>
        <h1 className="gradient-text">New Highlight</h1>
      </div>

      <form className="project-form glass" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h3>Highlight Details</h3>
            <div className="input-group">
              <label>Title *</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g., Travel, Food, Gym" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Display Order</label>
              <input 
                type="number" 
                name="display_order" 
                value={formData.display_order}
                onChange={handleChange}
              />
              <small style={{ color: 'var(--text-dim)', marginTop: '5px', display: 'block' }}>
                Lower numbers appear first.
              </small>
            </div>
          </div>

          <div className="form-section">
            <h3>Cover Media *</h3>
            <div className="input-group">
              <label>Upload Thumbnail Image or Video</label>
              <div className="file-upload-container">
                {mediaPreview ? (
                  <div className="preview-box">
                    {formData.media_type === 'video' ? (
                      <video src={mediaPreview} style={{ width: '100%', borderRadius: '12px' }} controls />
                    ) : (
                      <img src={mediaPreview} alt="Preview" />
                    )}
                    <button type="button" className="remove-img" onClick={() => { setMediaFile(null); setMediaPreview(null); }}>✕</button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      onChange={handleMediaChange} 
                      hidden
                    />
                    <FiUpload className="upload-icon" />
                    <span>Click to upload highlight cover</span>
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
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/lifestyle')}>Cancel</button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? 'Creating...' : 'Create Highlight'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHighlight;
