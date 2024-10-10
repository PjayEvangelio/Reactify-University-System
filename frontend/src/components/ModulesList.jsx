import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ModulesList.css';

function ModulesList() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/module/')
      .then(response => response.json())
      .then(data => {
        const sortedModules = data.sort((a, b) => a.full_name.localeCompare(b.full_name));
        setModules(sortedModules);
      })
      .catch(error => console.error("Failed to fetch modules:", error));
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="modules-list-header">Modules</h1>
      <div className="list-group">
        {modules.map(module => (
          <Link key={module.code} to={`/modules/${module.code}`} className="list-group-item list-group-item-action">
            {module.full_name} <span className="badge bg-primary rounded-pill">{module.code}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ModulesList;
