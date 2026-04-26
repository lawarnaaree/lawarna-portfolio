import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './ProjectList.css';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects?status=all');
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted successfully');
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-page page-fade">
      <div className="page-header">
        <div className="header-info">
          <h1 className="gradient-text">Projects</h1>
          <p className="subtitle">Manage and showcase your best work ({projects.length} projects).</p>
        </div>
        <div className="header-actions">
          <div className="search-wrapper glass">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={() => navigate('/projects/add')}>
            <FiPlus /> Add Project
          </button>
        </div>
      </div>

      <div className="projects-table-container glass">
        {loading ? (
          <div className="loading-state">Loading projects...</div>
        ) : filteredProjects.length > 0 ? (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <div className="project-cell">
                      <span className="project-title">{project.title}</span>
                      <span className="project-slug">/{project.slug}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${project.status}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{new Date(project.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="icon-btn" 
                        title="Edit"
                        onClick={() => navigate(`/projects/edit/${project.id}`)}
                      >
                        <FiEdit2 />
                      </button>
                      <button className="icon-btn" title="View"><FiExternalLink /></button>
                      <button 
                        className="icon-btn delete" 
                        title="Delete"
                        onClick={() => handleDelete(project.id, project.title)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <p>No projects found. Add your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
