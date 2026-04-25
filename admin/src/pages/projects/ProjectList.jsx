import React from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import './ProjectList.css';

const ProjectList = () => {
  const projects = [
    { 
      id: 1, 
      title: 'Modern E-commerce', 
      slug: 'modern-ecommerce', 
      status: 'published', 
      category: 'Web App', 
      date: '2024-03-15' 
    },
    { 
      id: 2, 
      title: 'Aesthetic Portfolio', 
      slug: 'aesthetic-portfolio', 
      status: 'draft', 
      category: 'Design', 
      date: '2024-03-10' 
    },
    { 
      id: 3, 
      title: 'Brand Identity v2', 
      slug: 'brand-identity', 
      status: 'published', 
      category: 'Branding', 
      date: '2024-02-28' 
    },
  ];

  return (
    <div className="projects-page page-fade">
      <div className="page-header">
        <div className="header-info">
          <h1 className="gradient-text">Projects</h1>
          <p className="subtitle">Manage and showcase your best work.</p>
        </div>
        <button className="add-btn">
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="projects-table-container glass">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="project-cell">
                    <span className="project-title">{project.title}</span>
                    <span className="project-slug">/{project.slug}</span>
                  </div>
                </td>
                <td><span className="category-tag">{project.category}</span></td>
                <td>
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                </td>
                <td>{project.date}</td>
                <td>
                  <div className="actions-cell">
                    <button className="icon-btn" title="Edit"><FiEdit2 /></button>
                    <button className="icon-btn" title="View"><FiExternalLink /></button>
                    <button className="icon-btn delete" title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
