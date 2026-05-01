import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
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
  
  // Highlight Items State
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ media: null, preview: null, caption: '', type: 'image' });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlight = async () => {
      try {
        const response = await api.get(`/lifestyle/highlights/single/${id}`);
        const hl = response.data.data;
        
        setFormData({
          title: hl.title || '',
          media_type: hl.media_type || 'image',
          display_order: hl.display_order || 0
        });
        setExistingMedia(hl.cover_image);
        setItems(hl.items || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load highlight');
        navigate('/lifestyle');
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(() => {
      fetchHighlight();
    }, 0);
    return () => clearTimeout(timeout);
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setFormData(prev => ({ ...prev, media_type: type }));
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleNewItemMedia = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onloadend = () => setNewItem(prev => ({ ...prev, media: file, preview: reader.result, type }));
      reader.readAsDataURL(file);
    }
  };

  const addItem = async () => {
    if (!newItem.media) {
      toast.error('Please select media for the story');
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append('media', newItem.media);
    data.append('caption', newItem.caption);
    data.append('media_type', newItem.type);
    data.append('order_index', items.length);

    try {
      const res = await api.post(`/lifestyle/highlights/${id}/items`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setItems(prev => [...prev, res.data.data]);
      setNewItem({ media: null, preview: null, caption: '', type: 'image' });
      toast.success('Story added to highlight!');
    } catch {
      toast.error('Failed to add story');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await api.delete(`/lifestyle/highlights/items/${itemId}`);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Story deleted');
    } catch {
      toast.error('Failed to delete story');
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
    } catch {
      toast.error('Failed to update highlight');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="add-project-page page-fade"><div className="loading-state">Loading...</div></div>;

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/lifestyle')}>
          <FiArrowLeft /> Back
        </button>
        <h1 className="gradient-text">Edit Highlight</h1>
      </div>

      <div className="form-grid-layout">
        <form className="project-form glass" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Highlight Details</h3>
            <div className="input-group">
              <label>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Display Order</label>
              <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} />
            </div>
            
            <div className="input-group">
              <label>Cover Media</label>
              <div className="file-upload-container">
                <div className="preview-box small">
                  {formData.media_type === 'video' ? (
                    <video src={mediaPreview || getFileUrl(existingMedia)} controls />
                  ) : (
                    <img src={mediaPreview || getFileUrl(existingMedia)} alt="Preview" />
                  )}
                  <label className="remove-img" style={{ cursor: 'pointer' }}>
                    <input type="file" accept="image/*,video/*" onChange={handleMediaChange} hidden />
                    ↻
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button type="submit" className="save-btn" disabled={isSubmitting}>
                <FiSave /> Save Changes
              </button>
            </div>
          </div>
        </form>

        <div className="project-form glass">
          <h3>Manage Stories</h3>
          <div className="items-grid">
            {items.map(item => (
              <div key={item.id} className="item-card">
                {item.media_type === 'video' ? <video src={getFileUrl(item.media_url)} /> : <img src={getFileUrl(item.media_url)} alt="" />}
                <button className="item-delete" onClick={() => deleteItem(item.id)}><FiTrash2 /></button>
              </div>
            ))}
          </div>

          <div className="add-item-form">
            <h4>Add New Story</h4>
            <div className="item-upload">
              {newItem.preview ? (
                <div className="preview-box">
                  {newItem.type === 'video' ? <video src={newItem.preview} controls /> : <img src={newItem.preview} alt="" />}
                  <button onClick={() => setNewItem(prev => ({ ...prev, media: null, preview: null }))}>✕</button>
                </div>
              ) : (
                <label className="upload-placeholder">
                  <input type="file" accept="image/*,video/*" onChange={handleNewItemMedia} hidden />
                  <FiPlus />
                  <span>Choose Media</span>
                </label>
              )}
            </div>
            <input 
              type="text" 
              placeholder="Caption (optional)" 
              value={newItem.caption} 
              onChange={e => setNewItem(prev => ({ ...prev, caption: e.target.value }))}
            />
            <button type="button" className="add-btn" onClick={addItem} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Story'}
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .form-grid-layout { display: grid; grid-template-columns: 400px 1fr; gap: 30px; }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .item-card { position: relative; aspect-ratio: 9/16; background: #000; border-radius: 8px; overflow: hidden; }
        .item-card img, .item-card video { width: 100%; height: 100%; object-fit: cover; }
        .item-delete { position: absolute; top: 5px; right: 5px; background: rgba(255,0,0,0.8); border: none; color: #fff; border-radius: 4px; padding: 5px; cursor: pointer; }
        .add-item-form { border-top: 1px solid var(--border); padding-top: 20px; }
        .item-upload { margin: 15px 0; }
        .add-btn { width: 100%; padding: 12px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 10px; }
        .add-item-form input { width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; border-radius: 4px; }
        @media (max-width: 900px) { .form-grid-layout { grid-template-columns: 1fr; } }
      ` }} />
    </div>
  );
};

export default EditHighlight;

