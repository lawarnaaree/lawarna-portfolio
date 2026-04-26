import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function useSettings() {
  const [settings, setSettings] = useState({
    site_name: 'Lawarna Portfolio',
    full_name: 'Lawarna Aree',
    job_role: 'Full-Stack Developer',
    bio: '',
    resume_url: '',
    github: '',
    linkedin: '',
    instagram: '',
    email: '',
    meta_title: '',
    meta_description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_URL}/settings`);
        if (res.data.success) {
          setSettings(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}
