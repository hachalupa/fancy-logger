// src/pages/ProjectsManager.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Section } from '../components/ui/Section';
import '../styles/App.css'
import { ButtonAdd, ButtonCancel, ButtonDelete, ButtonEdit, ButtonSave, ButtonBack, ButtonTask } from '../components/buttons/ActionButtons';

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
    <section className="manager-section">
      <div className="section-header">
        <h2>Projects Management ({myProjects.length})</h2>
        

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!showForm && (
          <div style={{ marginRight: "10px",display:'flex', gap: "10px"}}>
          <ButtonAdd onClick={() => setShowForm(true)} className="btn btn-primary">
            Create New Project
          </ButtonAdd>
          <ButtonBack onClick={() => navigate('/dashboard')} className="btn btn-secondary">Go Back</ButtonBack>
          </div>
        )}
        
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <h3>{editingId ? 'Edit Project' : 'Create New Project'}</h3>

          <div className='.description-form'>
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

          <div className='.description-form'>
            <label>Description</label>
            <textarea
              name="description"
              placeholder="What is this project about?"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className='.description-form'>
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
            <ButtonSave className="btn btn--primary">
              {editingId ? 'Update Project' : 'Create Project'}
            </ButtonSave>
            <ButtonCancel
              onClick={handleCancel}
              className="btn btn--secondary"
            >
              Cancel
            </ButtonCancel>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading projects...</p>
      ) : myProjects.length === 0 ? (
        <div className="empty-state">
          <p>No projects yet. Create one to get started!</p>
        </div>
      ) : (
        <Section>
        <div className="items-list">
          {myProjects.map((project) => (
            <div key={project.id} className="task-item">
              <div>
                <h3>{project.name}</h3>
                
                <span className="hours-badge">{project.hours}h</span>
                
                <div className="task-description">
                {project.description && (
                  <p>{project.description}</p>
                )}

                
                  <p>
                    <strong>Manager:</strong> {' '}
                    {project.manager === user?.id ? 'You' : `User #${project.manager}`}
                  </p>
                </div>
              </div>

              <div className="item-actions">
                <ButtonTask
                  onClick={() => handleViewTasks(project.id)}
                  title="View and manage tasks for this project"
                >
                  Tasks
                </ButtonTask>

                <ButtonEdit
                  onClick={() => handleEdit(project)}
                >
                  Edit
                </ButtonEdit>

                <ButtonDelete
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </ButtonDelete>
              </div>
            </div>
          ))}
        </div>
        </Section>
      )}
    </section>
  );
};

export default ProjectsManager;