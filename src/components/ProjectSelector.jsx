// src/components/ProjectSelector.jsx
const ProjectSelector = ({ projects, value, onChange }) => {
  
  const projectList = Array.isArray(projects) ? projects : [];

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
    >
      <option value="">Select Project...</option>
      {projectList.length > 0 ? (
        projectList.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))
      ) : (
        <option disabled>No projects available</option>
      )}
    </select>
  );
};

export default ProjectSelector;
