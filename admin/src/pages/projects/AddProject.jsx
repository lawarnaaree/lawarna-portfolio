import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AddProject.css';

const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    long_description: '',
    live_url: '',
    github_url: '',
    status: 'draft',
    is_featured: false,
    display_order: 0,
    tags: ''
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + mediaFiles.length > 5) {
      toast.error('Maximum 5 gallery images allowed');
      return;
    }

    const newFiles = [...mediaFiles, ...files];
    setMediaFiles(newFiles);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (thumbnail) {
      data.append('thumbnail', thumbnail);
    }

    mediaFiles.forEach(file => {
      data.append('media', file);
    });

    try {
      await api.post('/projects', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Project created successfully!');
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/projects')}>
          <FiArrowLeft /> Back to List
        </button>
        <h1 className="gradient-text">Add New Project</h1>
      </div>

      <form className="project-form glass" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h3>General Information</h3>
            <div className="input-group">
              <label>Project Title *</label>
              <input 
                type="text" 
                name="title" 
                placeholder="e.g., Modern E-commerce" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Short Description *</label>
              <textarea 
                name="short_description" 
                placeholder="Brief summary for the project card..." 
                value={formData.short_description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Tags (comma separated)</label>
              <input 
                type="text" 
                name="tags" 
                placeholder="React, Node.js, GSAP" 
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Main Assets & Links</h3>
            <div className="input-group">
              <label>Thumbnail Image *</label>
              <div className="file-upload-container">
                {thumbnailPreview ? (
                  <div className="preview-box">
                    <img src={thumbnailPreview} alt="Preview" />
                    <button type="button" className="remove-img" onClick={() => { setThumbnail(null); setThumbnailPreview(null); }}>✕</button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleThumbnailChange} 
                      required 
                      hidden
                    />
                    <FiUpload className="upload-icon" />
                    <span>Click to upload thumbnail</span>
                  </label>
                )}
              </div>
            </div>
            <div className="input-group">
              <label>Live Demo URL</label>
              <input 
                type="url" 
                name="live_url" 
                placeholder="https://example.com" 
                value={formData.live_url}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>GitHub Repository</label>
              <input 
                type="url" 
                name="github_url" 
                placeholder="https://github.com/user/repo" 
                value={formData.github_url}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section full-width">
            <h3>Additional Pictures (Gallery)</h3>
            <p className="section-hint">Showcase different parts of the website (max 5 images)</p>
            <div className="media-gallery-upload">
              <div className="gallery-previews">
                {mediaPreviews.map((prev, index) => (
                  <div key={index} className="gallery-preview-item">
                    <img src={prev} alt={`Gallery ${index}`} />
                    <button type="button" className="remove-media" onClick={() => removeMedia(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                {mediaFiles.length < 5 && (
                  <label className="gallery-add-more">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleMediaChange} 
                      hidden 
                    />
                    <FiUpload />
                    <span>Add</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="form-section full-width">
            <h3>Visibility & Order</h3>
            <div className="checkbox-row">
              <div className="checkbox-group">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="status" 
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'published' : 'draft' }))}
                  />
                  <span className="slider"></span>
                </label>
                <span>Publish immediately</span>
              </div>
              <div className="checkbox-group">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    name="is_featured" 
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  <span className="slider"></span>
                </label>
                <span>Feature on homepage</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/projects')}>Cancel</button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
