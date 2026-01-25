// src/pages/TaskTypesManager.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TaskTypesManager = () => {
  const { user } = useAuth();
  const [taskTypes, setTaskTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskTypes();
  }, []);

  const loadTaskTypes = async () => {
    try {
      const res = await api.get('/task-types');
      setTaskTypes(res.data || []);
    } catch (err) {
      setError('Failed to load task types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/task-types/${editingId}`, {}, {
          params: { name, description }
        });
      } else {
        await api.post('/task-types', {}, {
          params: { name, description }
        });
      }

      setName('');
      setDescription('');
      setEditingId(null);
      setShowForm(false);
      loadTaskTypes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task type');
    }
  };

  const handleEdit = (taskType) => {
    setEditingId(taskType.id);
    setName(taskType.name);
    setDescription(taskType.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await api.delete(`/task-types/${id}`);
      loadTaskTypes();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="manager-container">
      <h2>Task Types Management</h2>

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
            placeholder="Task type name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
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
          {taskTypes.map((taskType) => (
            <div key={taskType.id} className="item-card">
              <div>
                <h4>{taskType.name}</h4>
                {taskType.description && <p>{taskType.description}</p>}
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(taskType)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(taskType.id)} className="btn-delete">
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
