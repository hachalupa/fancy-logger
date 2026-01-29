// src/pages/ProjectsManager.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Section } from '../components/ui/Section';

const ProjectsManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hours: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      console.log('📥 Loading projects...');
      console.log('👤 Current user:', user);
      console.log('📍 user?.id:', user?.id);

      const res = await api.get('/projects');
      const projectsList = Array.isArray(res.data.data) ? res.data.data : [];
      setProjects(projectsList);
      console.log('✅ Projects loaded:', projectsList);

      const filtered = projectsList.filter(p => {
        console.log(`Project ${p.id}: manager=${p.manager}, user.id=${user?.id}, match=${p.manager === user?.id}`);
        return p.manager === user?.id;
      });
      console.log('🎯 Filtered projects (yours):', filtered);

      setProjects(projectsList);
    } catch (err) {
      console.error('❌ Error loading projects:', err);
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
    setSuccess('');

    if (!formData.name || !formData.hours) {
      setError('❌ Fill in all required fields (Name, Hours)');
      return;
    }

    try {
      if (editingId) {
        await api.patch(`/projects/${editingId}`, {
          name: formData.name,
          description: formData.description,
          hours: parseInt(formData.hours)
        });
        setSuccess('✅ Project updated!');
      } else {
        await api.post('/projects', {
          name: formData.name,
          description: formData.description,
          hours: parseInt(formData.hours)
        });
        setSuccess('✅ Project created!');
      }

      setFormData({ name: '', description: '', hours: '' });
      setEditingId(null);
      setShowForm(false);

      setTimeout(() => {
        loadProjects();
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error('❌ Save error:', err);
      setError(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description || '',
      hours: project.hours
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('🗑️ Delete this project? This cannot be undone.')) return;

    try {
      await api.delete(`/projects/${id}`);
      setSuccess('✅ Project deleted!');
      setTimeout(() => {
        loadProjects();
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError('Failed to delete project');
    }
  };

  const handleViewTasks = (projectId) => {
    console.log('📋 Opening tasks for project:', projectId);
    navigate(`/projects/${projectId}/tasks`);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', hours: '' });
    setError('');
  };

  // ✅ Фильтруй только свои проекты
  const myProjects = projects.filter(p => p.manager === user?.id);

  return (
    <div className="manager-section">
      <div className="section-header">
        <h2>📋 Projects Management ({myProjects.length})</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn btn--primary">
          ➕ Create New Project
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <h3>{editingId ? '✏️ Edit Project' : '✨ Create New Project'}</h3>

          <div>
            <label>Project Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Mobile App Redesign"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              placeholder="What is this project about?"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div>
            <label>Hours Allocated *</label>
            <input
              type="number"
              name="hours"
              placeholder="e.g., 40"
              value={formData.hours}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn--primary">
              {editingId ? '💾 Update Project' : '✅ Create Project'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn--secondary"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>⏳ Loading projects...</p>
      ) : myProjects.length === 0 ? (
        <div className="empty-state">
          <p>📭 No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <Section>
        <div className="items-grid">
          {myProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="card-header">
                <h3>{project.name}</h3>
                <span className="hours-badge">{project.hours}h</span>
              </div>

              {project.description && (
                <p className="card-description">{project.description}</p>
              )}

              <div className="card-meta">
                <p>
                  <strong>👤 Manager:</strong> {' '}
                  {project.manager === user?.id ? '👉 You' : `User #${project.manager}`}
                </p>
              </div>

              <div className="card-actions">
                <button
                  onClick={() => handleViewTasks(project.id)}
                  className="btn btn--outline btn--sm"
                  title="View and manage tasks for this project"
                >
                  📋 Tasks
                </button>

                <button
                  onClick={() => handleEdit(project)}
                  className="btn btn--outline btn--sm"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => handleDelete(project.id)}
                  className="btn btn--outline btn--sm"
                  style={{
                    background: 'var(--color-error)',
                    color: 'var(--color-white)',
                    border: 'none'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        </Section>
      )}
    </div>
  );
};

export default ProjectsManager;