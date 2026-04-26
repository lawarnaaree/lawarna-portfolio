import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload, FiImage, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './AddProject.css';

const EditProject = () => {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState('');
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [existingMedia, setExistingMedia] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        const data = response.data.data;
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          short_description: data.short_description || '',
          long_description: data.long_description || '',
          live_url: data.live_url || '',
          github_url: data.github_url || '',
          status: data.status || 'draft',
          is_featured: data.is_featured === 1,
          display_order: data.display_order || 0,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || '')
        });
        
        const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');

        if (data.thumbnail) {
          setExistingThumbnail(data.thumbnail.startsWith('http') ? data.thumbnail : `${baseUrl}${data.thumbnail}`);
        }

        if (data.media) {
          setExistingMedia(data.media.map(m => ({
            url: m.media_url.startsWith('http') ? m.media_url : `${baseUrl}${m.media_url}`,
            path: m.media_url
          })));
        }
      } catch (error) {
        toast.error('Failed to fetch project details');
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, navigate]);

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
    if (files.length + mediaFiles.length + existingMedia.length > 5) {
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

  const removeNewMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (index) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
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

    // Pass existing media paths to keep
    existingMedia.forEach(m => {
      data.append('existing_media[]', m.path);
    });

    // Pass new media files
    mediaFiles.forEach(file => {
      data.append('media', file);
    });

    try {
      await api.put(`/projects/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Project updated successfully!');
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error(error.response?.data?.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="admin-content">Loading...</div>;

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/projects')}>
          <FiArrowLeft /> Back to List
        </button>
        <h1 className="gradient-text">Edit Project</h1>
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
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>Short Description *</label>
              <textarea 
                name="short_description" 
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
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Thumbnail & Links</h3>
            <div className="input-group">
              <label>Thumbnail Image</label>
              <div className="file-upload-container">
                {(thumbnailPreview || existingThumbnail) ? (
                  <div className="preview-box">
                    <img src={thumbnailPreview || existingThumbnail} alt="Preview" />
                    <button type="button" className="remove-img" onClick={() => { 
                      setThumbnail(null); 
                      setThumbnailPreview(null);
                      setExistingThumbnail(''); 
                    }}>✕</button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleThumbnailChange} 
                      hidden
                    />
                    <FiUpload className="upload-icon" />
                    <span>Click to upload new image</span>
                  </label>
                )}
              </div>
            </div>
            <div className="input-group">
              <label>Live Demo URL</label>
              <input 
                type="url" 
                name="live_url" 
                value={formData.live_url}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label>GitHub Repository</label>
              <input 
                type="url" 
                name="github_url" 
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
                {/* Existing Media */}
                {existingMedia.map((m, index) => (
                  <div key={`existing-${index}`} className="gallery-preview-item">
                    <img src={m.url} alt={`Existing ${index}`} />
                    <button type="button" className="remove-media" onClick={() => removeExistingMedia(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                
                {/* New Previews */}
                {mediaPreviews.map((prev, index) => (
                  <div key={`new-${index}`} className="gallery-preview-item">
                    <img src={prev} alt={`New ${index}`} />
                    <button type="button" className="remove-media" onClick={() => removeNewMedia(index)}>
                      <FiX />
                    </button>
                  </div>
                ))}

                {(existingMedia.length + mediaFiles.length) < 5 && (
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
                <span>Published</span>
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
                <span>Featured on homepage</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/projects')}>Cancel</button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
