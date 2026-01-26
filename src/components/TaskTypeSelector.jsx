// src/components/TaskTypeSelector.jsx
const TaskTypeSelector = ({ taskTypes, value, onChange }) => {
  
  const taskList = Array.isArray(taskTypes) ? taskTypes : [];

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
    >
      <option value="">Select Task...</option>
      {taskList.length > 0 ? (
        taskList.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))
      ) : (
        <option disabled>No task types available</option>
      )}
    </select>
  );
};

export default TaskTypeSelector;
