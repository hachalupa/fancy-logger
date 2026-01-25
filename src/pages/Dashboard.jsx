// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../hooks/useTimer';
import Timer from '../components/Timer';
import api from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const timer = useTimer();
  
  // TAB STATE
  const [activeTab, setActiveTab] = useState('log');  // 'log', 'projects', 'tasks'
  
  // PROJECTS
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ 
    name: '', 
    description: '', 
    projectManager: '', 
    hoursAllocated: '' 
  });
  const [editingProject, setEditingProject] = useState(null);
  
  // TASK TYPES
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskForm, setTaskForm] = useState({ name: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  
  // WORK ENTRIES
  const [entries, setEntries] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [comment, setComment] = useState('');
  
  // UI STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [projRes, tasksRes, entriesRes] = await Promise.all([
        api.get('/projects').catch(() => ({ data: [] })),
        api.get('/types').catch(() => ({ data: [] })),
        api.get('/work-entries').catch(() => ({ data: [] }))
      ]);
      
      setProjects(Array.isArray(projRes.data) ? projRes.data : []);
      setTaskTypes(Array.isArray(tasksRes.data) ? tasksRes.data : []);
      setEntries(Array.isArray(entriesRes.data) ? entriesRes.data : []);
      
      console.log('✅ Projects loaded:', projRes.data);
      console.log('✅ Task types loaded:', tasksRes.data);
    } catch (err) {
      console.error('Error loading:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ===== PROJECTS HANDLERS =====
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!projectForm.name || !projectForm.projectManager || !projectForm.hoursAllocated) {
      setError('❌ Fill in all required fields (Name, Manager, Hours)');
      return;
    }

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject.id}`, {}, { params: projectForm });
        setSuccess('✅ Project updated successfully!');
      } else {
        await api.post('/projects', {}, { params: projectForm });
        setSuccess('✅ Project created successfully!');
      }

      setProjectForm({ name: '', description: '', projectManager: '', hoursAllocated: '' });
      setEditingProject(null);
      setShowProjectForm(false);
      
      setTimeout(() => {
        loadAllData();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Save project error:', err);
      setError('❌ ' + (err.response?.data?.message || 'Failed to save project'));
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description || '',
      projectManager: project.projectManager,
      hoursAllocated: project.hoursAllocated.toString()
    });
    setShowProjectForm(true);
    setActiveTab('projects');
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('🗑️ Delete this project? This cannot be undone.')) return;

    try {
      await api.delete(`/projects/${id}`);
      setSuccess('✅ Project deleted!');
      setTimeout(() => {
        loadAllData();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('❌ Failed to delete project');
    }
  };

  const handleCancelProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    setProjectForm({ name: '', description: '', projectManager: '', hoursAllocated: '' });
    setError('');
  };

  // ===== TASK TYPES HANDLERS =====
  const handleSaveTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!taskForm.name) {
      setError('❌ Task name is required');
      return;
    }

    try {
      if (editingTask) {
        await api.put(`/types/${editingTask.id}`, {}, { params: taskForm });
        setSuccess('✅ Task type updated successfully!');
      } else {
        await api.post('/types', {}, { params: taskForm });
        setSuccess('✅ Task type created successfully!');
      }

      setTaskForm({ name: '', description: '' });
      setEditingTask(null);
      setShowTaskForm(false);
      
      setTimeout(() => {
        loadAllData();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Save task error:', err);
      setError('❌ ' + (err.response?.data?.message || 'Failed to save task type'));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      name: task.name,
      description: task.description || ''
    });
    setShowTaskForm(true);
    setActiveTab('tasks');
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('🗑️ Delete this task type? This cannot be undone.')) return;

    try {
      await api.delete(`/types/${id}`);
      setSuccess('✅ Task type deleted!');
      setTimeout(() => {
        loadAllData();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('❌ Failed to delete task type');
    }
  };

  const handleCancelTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    setTaskForm({ name: '', description: '' });
    setError('');
  };

  // ===== WORK ENTRY HANDLER =====
  const handleSaveEntry = async () => {
    if (!selectedProject || !selectedTask) {
      setError('❌ Select both project and task type');
      return;
    }

    if (timer.seconds === 0) {
      setError('❌ Timer must be greater than 0 seconds');
      return;
    }

    try {
      setError('');
      await api.post('/work-entries', {}, {
        params: {
          projectId: selectedProject,
          taskTypeId: selectedTask,
          comment: comment || null,
          duration: timer.seconds
        }
      });

      setSuccess('✅ Work entry saved!');
      timer.reset();
      setComment('');
      setSelectedProject('');
      setSelectedTask('');
      
      setTimeout(() => {
        loadAllData();
        setSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Save entry error:', err);
      setError('❌ ' + (err.response?.data?.message || 'Failed to save entry'));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <header className="header">
          <h1>⏱️ Fancy Logger</h1>
        </header>
        <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
          ⏳ Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>⏱️ Fancy Logger</h1>
        <div>
          <span>{user?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => setActiveTab('log')}
        >
          ⏱️ Time Logger
        </button>
        <button 
          className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          📋 Projects ({projects.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          ✓ Task Types ({taskTypes.length})
        </button>
      </nav>

      <main className="container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* ===== TIME LOGGER TAB ===== */}
        {activeTab === 'log' && (
          <section className="timer-section">
            <Timer timer={timer} />
            
            <div className="form-group">
              <div className="form-row">
                <div className="form-col">
                  <label>Project *</label>
                  <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Project...</option>
                    {projects.length > 0 ? (
                      projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))
                    ) : (
                      <option disabled>No projects - create one first!</option>
                    )}
                  </select>
                </div>
                
                <div className="form-col">
                  <label>Task Type *</label>
                  <select 
                    value={selectedTask}
                    onChange={(e) => setSelectedTask(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select Task...</option>
                    {taskTypes.length > 0 ? (
                      taskTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))
                    ) : (
                      <option disabled>No task types - create one first!</option>
                    )}
                  </select>
                </div>
              </div>
              
              <input
                type="text"
                placeholder="Optional comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-input"
              />
              
              <button 
                onClick={handleSaveEntry} 
                className="save-btn"
                disabled={timer.seconds === 0 || !selectedProject || !selectedTask}
              >
                💾 Save Entry ({formatDuration(timer.seconds)})
              </button>
            </div>

            <section className="entries-section">
              <h3>📊 Recent Work Entries ({entries.length})</h3>
              {entries.length === 0 ? (
                <p className="no-entries">No entries yet. Start tracking your work!</p>
              ) : (
                <div className="entries-list">
                  {entries.slice(0, 15).map((entry) => (
                    <div key={entry.id} className="entry-item">
                      <div className="entry-header">
                        <strong>{entry.project}</strong>
                        <span className="entry-type">{entry.task}</span>
                      </div>
                      {entry.comment && <p className="entry-comment">💬 {entry.comment}</p>}
                      <div className="entry-meta">
                        <span className="duration">⏱️ {formatDuration(entry.duration)}</span>
                        <span className="date">📅 {formatDate(entry.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        )}

        {/* ===== PROJECTS TAB ===== */}
        {activeTab === 'projects' && (
          <section className="manager-section">
            <div className="section-header">
              <h2>📋 Projects Management</h2>
              {!showProjectForm && (
                <button 
                  onClick={() => setShowProjectForm(true)}
                  className="btn-primary"
                >
                  ➕ Create New Project
                </button>
              )}
            </div>

            {showProjectForm && (
              <form onSubmit={handleSaveProject} className="manager-form">
                <h3>{editingProject ? '✏️ Edit Project' : '✨ Create New Project'}</h3>
                
                <div>
                  <label>Project Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Website Redesign"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    placeholder="What is this project about?"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div>
                  <label>Project Manager Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., John Smith"
                    value={projectForm.projectManager}
                    onChange={(e) => setProjectForm({...projectForm, projectManager: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label>Hours Allocated *</label>
                  <input
                    type="number"
                    placeholder="e.g., 40"
                    value={projectForm.hoursAllocated}
                    onChange={(e) => setProjectForm({...projectForm, hoursAllocated: e.target.value})}
                    min="1"
                    required
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    {editingProject ? '💾 Update Project' : '✅ Create Project'}
                  </button>
                  <button type="button" onClick={handleCancelProjectForm} className="btn-secondary">
                    ✕ Cancel
                  </button>
                </div>
              </form>
            )}

            {projects.length === 0 && !showProjectForm && (
              <div className="empty-state">
                <p>📭 No projects yet</p>
                <p>Click "Create New Project" button to get started!</p>
              </div>
            )}

            <div className="items-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="card-header">
                    <h3>{project.name}</h3>
                    <span className="hours-badge">{project.hoursAllocated}h</span>
                  </div>
                  {project.description && <p className="card-description">{project.description}</p>}
                  <div className="card-meta">
                    <p><strong>👤 Manager:</strong> {project.projectManager}</p>
                  </div>
                  <div className="card-actions">
                    <button 
                      onClick={() => handleEditProject(project)}
                      className="btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== TASK TYPES TAB ===== */}
        {activeTab === 'tasks' && (
          <section className="manager-section">
            <div className="section-header">
              <h2>✓ Task Types Management</h2>
              {!showTaskForm && (
                <button 
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary"
                >
                  ➕ Create New Task Type
                </button>
              )}
            </div>

            {showTaskForm && (
              <form onSubmit={handleSaveTask} className="manager-form">
                <h3>{editingTask ? '✏️ Edit Task Type' : '✨ Create New Task Type'}</h3>
                
                <div>
                  <label>Task Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Design Creation, Programming, Testing"
                    value={taskForm.name}
                    onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    placeholder="What does this task type involve?"
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn-primary">
                    {editingTask ? '💾 Update Task Type' : '✅ Create Task Type'}
                  </button>
                  <button type="button" onClick={handleCancelTaskForm} className="btn-secondary">
                    ✕ Cancel
                  </button>
                </div>
              </form>
            )}

            {taskTypes.length === 0 && !showTaskForm && (
              <div className="empty-state">
                <p>📭 No task types yet</p>
                <p>Click "Create New Task Type" button to get started!</p>
              </div>
            )}

            <div className="items-list">
              {taskTypes.map((task) => (
                <div key={task.id} className="task-item">
                  <div>
                    <h4>✓ {task.name}</h4>
                    {task.description && <p className="task-description">{task.description}</p>}
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// Утилиты
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default Dashboard;