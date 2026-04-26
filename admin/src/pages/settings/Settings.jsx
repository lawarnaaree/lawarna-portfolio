import React, { useState, useEffect } from 'react';
import { FiSave, FiGlobe, FiUser, FiShare2, FiMail, FiLoader } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    site_name: '',
    meta_title: '',
    meta_description: '',
    full_name: '',
    job_role: '',
    bio: '',
    resume_url: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    instagram: '',
    twitter: '',
    behance: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        // Merge with defaults to ensure all fields exist
        setSettings(prev => ({ ...prev, ...response.data.data }));
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="settings-page page-fade">
      <div className="loading-state">
        <FiLoader className="spin" /> Loading configurations...
      </div>
    </div>
  );

  return (
    <div className="settings-page page-fade">
      <div className="settings-header">
        <h1 className="gradient-text">Site Settings</h1>
        <p className="subtitle">Configure your portfolio identity, social links, and SEO preferences.</p>
      </div>

      <div className="settings-container glass">
        <div className="settings-sidebar">
          <button 
            className={`tab-link ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FiGlobe /> Site Identity
          </button>
          <button 
            className={`tab-link ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FiUser /> Personal Info
          </button>
          <button 
            className={`tab-link ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            <FiShare2 /> Social Media
          </button>
          <button 
            className={`tab-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <FiMail /> Contact Details
          </button>
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            {activeTab === 'general' && (
              <div className="tab-pane page-fade">
                <h3>Site Identity</h3>
                <div className="input-group">
                  <label>Site Name</label>
                  <input 
                    type="text" 
                    name="site_name" 
                    value={settings.site_name} 
                    onChange={handleChange}
                    placeholder="e.g., Lawarna Portfolio"
                  />
                </div>
                <div className="input-group">
                  <label>SEO Meta Title</label>
                  <input 
                    type="text" 
                    name="meta_title" 
                    value={settings.meta_title} 
                    onChange={handleChange}
                    placeholder="Title seen in browser tabs and search results"
                  />
                </div>
                <div className="input-group">
                  <label>SEO Meta Description</label>
                  <textarea 
                    name="meta_description" 
                    rows="4"
                    value={settings.meta_description} 
                    onChange={handleChange}
                    placeholder="Brief description for search engines"
                  ></textarea>
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <div className="tab-pane page-fade">
                <h3>Personal Information</h3>
                <div className="input-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="full_name" 
                    value={settings.full_name} 
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Job Role / Profession</label>
                  <input 
                    type="text" 
                    name="job_role" 
                    value={settings.job_role} 
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer & UI Designer"
                  />
                </div>
                <div className="input-group">
                  <label>Short Bio</label>
                  <textarea 
                    name="bio" 
                    rows="4"
                    value={settings.bio} 
                    onChange={handleChange}
                    placeholder="Write a brief introduction about yourself"
                  ></textarea>
                </div>
                <div className="input-group">
                  <label>Resume / CV URL</label>
                  <input 
                    type="url" 
                    name="resume_url" 
                    value={settings.resume_url} 
                    onChange={handleChange}
                    placeholder="Direct link to your CV (Google Drive, Dropbox, etc.)"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="tab-pane page-fade">
                <h3>Social Media Links</h3>
                <div className="form-grid-2">
                  <div className="input-group">
                    <label>GitHub Profile</label>
                    <input 
                      type="url" 
                      name="github" 
                      value={settings.github} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>LinkedIn Profile</label>
                    <input 
                      type="url" 
                      name="linkedin" 
                      value={settings.linkedin} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Instagram Handle</label>
                    <input 
                      type="text" 
                      name="instagram" 
                      value={settings.instagram} 
                      onChange={handleChange}
                      placeholder="@yourhandle"
                    />
                  </div>
                  <div className="input-group">
                    <label>Twitter / X URL</label>
                    <input 
                      type="url" 
                      name="twitter" 
                      value={settings.twitter} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Behance Portfolio</label>
                    <input 
                      type="url" 
                      name="behance" 
                      value={settings.behance} 
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="tab-pane page-fade">
                <h3>Contact Details</h3>
                <div className="input-group">
                  <label>Professional Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={settings.email} 
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={settings.phone} 
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label>Location / Office Address</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={settings.location} 
                    onChange={handleChange}
                    placeholder="e.g., Kathmandu, Nepal"
                  />
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? <FiLoader className="spin" /> : <FiSave />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
