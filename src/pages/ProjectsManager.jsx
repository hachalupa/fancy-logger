// src/pages/ProjectsManager.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProjectsManager = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectManager: '',
    hoursAllocated: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data || []);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, {}, {
          params: formData
        });
      } else {
        await api.post('/projects', {}, {
          params: formData
        });
      }

      setFormData({ name: '', description: '', projectManager: '', hoursAllocated: '' });
      setEditingId(null);
      setShowForm(false);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description || '',
      projectManager: project.projectManager,
      hoursAllocated: project.hoursAllocated.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', projectManager: '', hoursAllocated: '' });
  };

  return (
    <div className="manager-container">
      <h2>Projects Management</h2>

      {error && <div className="error-message">{error}</div>}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Project
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <input
            type="text"
            name="name"
            placeholder="Project name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
          <input
            type="text"
            name="projectManager"
            placeholder="Project manager name"
            value={formData.projectManager}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="hoursAllocated"
            placeholder="Hours allocated"
            value={formData.hoursAllocated}
            onChange={handleChange}
            required
            min="1"
          />
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="items-list">
          {projects.map((project) => (
            <div key={project.id} className="item-card">
              <div>
                <h4>{project.name}</h4>
                {project.description && <p>{project.description}</p>}
                <p className="meta">
                  Manager: <strong>{project.projectManager}</strong> | 
                  Hours: <strong>{project.hoursAllocated}h</strong>
                </p>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(project)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(project.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManager;
