import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import '../projects/AddProject.css'; // Reuse project form styles

const AddJourney = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    role: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    type: 'work'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = { 
        ...formData,
        end_date: formData.is_current ? null : (formData.end_date || null),
        is_current: formData.is_current ? 1 : 0
      };

      await api.post('/journey', submissionData);
      toast.success('Journey entry added successfully!');
      navigate('/journey');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add journey entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-project-page page-fade">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/journey')}>
          <FiArrowLeft /> Back to List
        </button>
        <h1 className="gradient-text">Add New Journey</h1>
      </div>

      <form className="project-form glass" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h3>General Information</h3>
            <div className="input-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="work">Work Experience</option>
                <option value="education">Education</option>
                <option value="award">Award/Achievement</option>
              </select>
            </div>
            <div className="input-group">
              <label>Role/Degree *</label>
              <input 
                type="text" 
                name="role" 
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Developer"
              />
            </div>
            <div className="input-group">
              <label>Company/Institution *</label>
              <input 
                type="text" 
                name="company" 
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g. Google"
              />
            </div>
            <div className="input-group">
              <label>Brief Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Full-time"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Timeline & Status</h3>
            <div className="input-group">
              <label>Start Date *</label>
              <input 
                type="date" 
                name="start_date" 
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>End Date</label>
              <input 
                type="date" 
                name="end_date" 
                value={formData.end_date}
                onChange={handleChange}
                disabled={formData.is_current}
              />
            </div>
            <div className="checkbox-group" style={{ marginTop: '10px' }}>
              <label className="switch">
                <input 
                  type="checkbox" 
                  name="is_current" 
                  checked={formData.is_current}
                  onChange={handleChange}
                />
                <span className="slider"></span>
              </label>
              <span>Currently active</span>
            </div>
          </div>

          <div className="form-section full-width">
            <h3>Description</h3>
            <div className="input-group">
              <label>Detailed Description *</label>
              <textarea 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your responsibilities or achievements..."
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/journey')}>Cancel</button>
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            <FiSave /> {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJourney;
