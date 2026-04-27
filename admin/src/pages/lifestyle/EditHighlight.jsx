import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import '../projects/AddProject.css';

import { getFileUrl } from '../../utils/helpers';

const EditHighlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    media_type: 'image',
    display_order: 0
  });
  const [existingMedia, setExistingMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlight = async () => {
      try {
        const response = await api.get('/lifestyle/highlights');
        const highlights = response.data.data;
        const hl = highlights.find(h => h.id === parseInt(id));
        if (!hl) throw new Error('Highlight not found');
        
        setFormData({
          title: hl.title || '',
          media_type: hl.media_type || 'image',
          display_order: hl.display_order || 0
        });
        setExistingMedia(hl.cover_image);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load highlight');
        navigate('/lifestyle');
      } finally {
        setLoading(false);
      }
    };
    fetchHighlight();
  }, [id, navigate]);

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
    setIsSubmitting(true);

    const data = new FormData();
    if (mediaFile) data.append('cover_image', mediaFile);
    data.append('title', formData.title);
    data.append('media_type', formData.media_type);
    data.append('display_order', formData.display_order);

    try {
      await api.put(`/lifestyle/highlights/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Highlight updated successfully!');
      navigate('/lifestyle');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to update highlight');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="add-project-page page-fade"><div className="loading-state">Loading...</div></div>;

  const displayMedia = mediaPreview || getFileUrl(existingMedia);

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/lifestyle')}>
          <FiArrowLeft /> Back to Feed
        </button>
        <h1 className="gradient-text">Edit Highlight</h1>
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
            </div>
          </div>

          <div className="form-section">
            <h3>Cover Media</h3>
            <div className="input-group">
              <label>Current Cover (click to replace)</label>
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
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/lifestyle')}>Cancel</button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? 'Saving...' : 'Update Highlight'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditHighlight;
