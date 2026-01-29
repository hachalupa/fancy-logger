import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TaskTypesManager = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    name: '',
    description: '',
    hours: '',
    status: false
  })
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskTypes();
  }, []);

  const loadTaskTypes = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(Array.isArray(res.data.data) ? res.data.data : [] );

      console.log("loadTaskTypes",res.data)
    } catch (err) {
      console.error("Error loading:", err)
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        console.log("alo ",editingId)
        await api.patch(`/tasks/${editingId}`, {
          name: taskForm.name,
          description: taskForm.description,
          hours: taskForm.hours,
          status: taskForm.status
        });
      } else {
        await api.post('/tasks', {
          name: taskForm.name,
          description: taskForm.description,
          hours: taskForm.hours,
          status: taskForm.status
        });
      }

      setTaskForm({ name: '', description: '', hours: '', status: false });
      setEditingId(null);
      setShowForm(false);
      loadTaskTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task type');
    }
  };

  const handleEdit = (task) => {
    console.log(task.id);
    setEditingId(task.id);
    setTaskForm({
      name: task.name,
      description: task.description || '',
      hours: task.hours,
      status: task.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await api.delete(`/tasks/${id}`);
      loadTaskTypes();
    } catch (err) {
      console.log('Delete', err)
      setError('Failed to delete');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setTaskForm({ name: '', description: '', hours: '', status: false });
  };

  return (
    <div className="manager-container">
      <h2>Tasks Management</h2>

      {error && <div className="error-message">{error}</div>}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Add New Task Type
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="manager-form">
          <input
            type="text"
            placeholder="Tasks name"
            value={taskForm.name}
            onChange={(e) => setTaskForm({...taskForm, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={taskForm.description}
            onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
            rows="4"
          />
          <input
            type="number"
            name="hours"
            placeholder="Hours allocated"
            value={taskForm.hours}
            onChange={(e) => setTaskForm({...taskForm, hours: parseInt(e.target.value)})}
            required
            min="1"
          />
          <div>
            <label>Status</label>
            <input
              type='checkbox'
              checked={taskForm.status || false}
              onChange={(e) => setTaskForm({...taskForm, status: e.target.checked})}
            />
          </div>
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
          {tasks.map((task) => (
            <div key={task.id} className="item-card">
              <div>
                <h4>{task.name}</h4>
                {task.description && <p>{task.description}</p>}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(task)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn-delete">
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

export default TaskTypesManager;
