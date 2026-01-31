import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import '../styles/project-tasks.css';
import { ButtonAdd, ButtonBack, ButtonCancel, ButtonDelete, ButtonEdit, ButtonSave } from '../components/buttons/ActionButtons';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [types, setTypes] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    hours: '',
    status: false,
    typeId: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const projectRes = await api.get(`/projects/${projectId}`);
      const projectData = projectRes.data.data || projectRes.data;
      setProject(projectData);

      const tasksRes = await api.get(`/tasks?projectId=${projectId}`);
      const tasksList = Array.isArray(tasksRes.data.data) 
        ? tasksRes.data.data 
        : Array.isArray(tasksRes.data) 
        ? tasksRes.data 
        : [];
      setTasks(tasksList);

      const typesRes = await api.get('/types');
      const typesList = Array.isArray(typesRes.data.data) 
        ? typesRes.data.data 
        : Array.isArray(typesRes.data) 
        ? typesRes.data 
        : [];
      setTypes(typesList);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load project or tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.description || !formData.hours || !formData.typeId) {
      setError('❌ Fill in all required fields');
      return;
    }


    const projectTasksHours = tasks
      .filter(t => t.projectId === parseInt(projectId) && t.id !== editingId) 
      .reduce((sum, t) => sum + (t.hours || 0), 0);
    const totalHours = projectTasksHours + parseInt(formData.hours);
    
    if (totalHours > project.hours) {
      setError(
        `❌ Total task hours (${totalHours}h) exceeds project allocation (${project.hours}h). ` +
        `You can allocate max ${project.hours - projectTasksHours}h for this task.`
      );
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        hours: parseInt(formData.hours),
        status: formData.status,
        projectId: parseInt(projectId),
        typeId: parseInt(formData.typeId)
      };

      if (editingId) {
        await api.patch(`/tasks/${editingId}`, payload);
        setSuccess('✅ Task updated!');
      } else {
        await api.post('/tasks', payload);
        setSuccess('✅ Task created!');
      }

      setFormData({ name: '', description: '', hours: '', status: false, typeId: '' });
      setEditingId(null);
      setShowForm(false);

      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 1000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setFormData({
      name: task.name,
      description: task.description || '',
      hours: task.hours,
      status: task.status || false,
      typeId: task.typeId || task.type?.id || (types.length > 0 ? types[0].id : '')
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: !currentStatus });
      setSuccess('✅ Task status updated!');
      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 500);
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('🗑️ Delete this task? This cannot be undone.')) return;

    try {
      await api.delete(`/tasks/${id}`);
      setSuccess('✅ Task deleted!');
      setTimeout(() => {
        loadData();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', description: '', hours: '', status: false, typeId: '' });
    setError('');
  };

  const getTypeName = (typeOrId) => {
    if (typeOrId && typeof typeOrId === 'object' && typeOrId.name) {
      return typeOrId.name;
    }
    const type = types.find(t => t.id === parseInt(typeOrId));
    return type ? type.name : `Type #${typeOrId}`;
  };

  if (loading) {
    return (
      <div className="project-tasks-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p style={{ fontSize: '18px' }}>⏳ Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-tasks-container" style={{ textAlign: 'center', paddingTop: '60px' }}>
        <p>❌ Project not found</p>
        <button onClick={() => navigate('/projects')} className="btn btn--primary">
          ← Back to Projects
        </button>
      </div>
    );
  }

  const myTasks = tasks.filter(t => t.projectId === parseInt(projectId));
  const totalTasksHours = myTasks.reduce((sum, t) => sum + (t.hours || 0), 0);
  const completedTasks = myTasks.filter(t => t.status).length;
  const completionPercentage = myTasks.length > 0 
    ? Math.round((completedTasks / myTasks.length) * 100) 
    : 0;
  const isProjectCompleted = myTasks.length > 0 && myTasks.every(t => t.status === true) && totalTasksHours === project.hours;
  const isOverBudget = totalTasksHours > project.hours;

  return (
    <div className="project-tasks-container">
      {/* ===== HEADER ===== */}
      <div className="project-header">
        <div className="project-header-content">
          <h1>{project.name}</h1>
          <p className="project-header-subtitle">{project.description || 'No description'}</p>
          
          {/* Meta Information */}
          <div className="project-header-meta">
            <div className="meta-item">
              <div className="meta-item-label">Status</div>
              <div className="meta-item-value" style={{ color: isProjectCompleted ? 'var(--color-success)' : 'var(--color-warning)' }}>
                {isProjectCompleted ? 'Completed' : 'In Progress'}
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-item-label">Tasks</div>
              <div className="meta-item-value">{completedTasks}/{myTasks.length}</div>
            </div>
            <div className="meta-item">
              <div className="meta-item-label">Hours Used</div>
              <div className="meta-item-value" style={{ color: isOverBudget ? 'var(--color-error)' : 'var(--color-success)' }}>
                {totalTasksHours}/{project.hours}h
              </div>
            </div>
          </div>
        </div>

        <div className="project-header-actions">
          <ButtonBack
            onClick={() => navigate('/projects')}
            className="btn btn-secondary"
          >
            Back to Projects
          </ButtonBack>
        </div>
      </div>

      {/* ===== ALERTS ===== */}
      {error && (
        <div className="message-alert error">
          <span className="message-icon">❌</span>
          <div className="message-content">{error}</div>
          <button className="message-close" onClick={() => setError('')}>✕</button>
        </div>
      )}
      {success && (
        <div className="message-alert success">
          <span className="message-icon">✅</span>
          <div className="message-content">{success}</div>
          <button className="message-close" onClick={() => setSuccess('')}>✕</button>
        </div>
      )}

      {/* ===== PROGRESS SECTION ===== */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>📊 Project Progress</h3>
          <div className={`progress-status ${isProjectCompleted ? 'completed' : 'pending'}`}>
            {isProjectCompleted ? 'Project Completed!' : 'In Progress'}
          </div>
        </div>

        {/* Hours Progress */}
        <div className="progress-item">
          <div className="progress-label">
            <span className="progress-label-title">Hours Allocated</span>
            <span className="progress-label-value">{totalTasksHours}h / {project.hours}h</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${isOverBudget ? 'over-budget' : ''}`}
              style={{ width: `${Math.min((totalTasksHours / project.hours) * 100, 100)}%` }}
            />
          </div>
          {isOverBudget && (
            <div className="progress-warning">
              ⚠️ Over budget by {totalTasksHours - project.hours}h
            </div>
          )}
        </div>

        {/* Task Completion */}
        <div className="task-completion">
          <div className="completion-stat">
            <div className="completion-stat-number">{completionPercentage}%</div>
            <div className="completion-stat-label">Completion</div>
          </div>
          <div className="completion-stat">
            <div className="completion-stat-number">{completedTasks}/{myTasks.length}</div>
            <div className="completion-stat-label">Tasks Completed</div>
          </div>
        </div>
      </div>

      {/* ===== FORM SECTION ===== */}
      <div className="task-form-section">
        <div className="form-section-header">
          <h3>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
          {!showForm && (
            <ButtonAdd 
              onClick={() => setShowForm(true)}
              className="btn btn--primary btn--sm"
            >
              Add New Task
            </ButtonAdd>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Task Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Design Database Schema"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Task Type *</label>
                <select
                  name="typeId"
                  value={formData.typeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type...</option>
                  {types.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hours Allocated *</label>
                <input
                  type="number"
                  name="hours"
                  placeholder="e.g., 8"
                  value={formData.hours}
                  onChange={handleChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description *</label>
                <textarea
                  name="description"
                  placeholder="What needs to be done? Any notes or checklist?"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <span>Mark as completed</span>
                </label>
              </div>
            </div>

            <div className="form-buttons">
              <ButtonSave type="submit" className="btn btn--primary">
                {editingId ? 'Update Task' : 'Create Task'}
              </ButtonSave>
              <ButtonCancel 
                type="button" 
                onClick={handleCancel} 
                className="btn btn--secondary"
              >
                Cancel
              </ButtonCancel>
            </div>
          </form>
        )}
      </div>

      {/* ===== TASKS LIST ===== */}
      <div className="tasks-section">
        {myTasks.length === 0 && !showForm && (
          <div className="empty-state">
            <p>📭 No tasks yet</p>
            <p style={{ fontSize: '0.9em', marginTop: 'var(--space-8)' }}>Create one to start tracking your work!</p>
          </div>
        )}

        {myTasks.map((task) => {
          const hoursPercentage = (task.hours / project.hours) * 100;
          
          return (
            <div 
              key={task.id} 
              className={`task-item ${task.status ? 'completed' : ''}`}
            >
              <div className="task-content">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.status || false}
                  onChange={() => handleToggleStatus(task.id, task.status)}
                  title="Mark as complete"
                />

                <div className="task-details">
                  <h4 className="task-title">
                    {task.status ? '✓' : '○'} {task.name}
                  </h4>

                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  <div className="task-meta">
                    <div className="meta-badge type">
                      {getTypeName(task.type || task.typeId)}
                    </div>
                    <div className="meta-badge hours">
                      {task.hours}h ({hoursPercentage.toFixed(1)}%)
                    </div>
                    <div className={`meta-badge status`}>
                      {task.status ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="task-actions">
                <ButtonEdit
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </ButtonEdit>
                <ButtonDelete
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </ButtonDelete>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTasks;
