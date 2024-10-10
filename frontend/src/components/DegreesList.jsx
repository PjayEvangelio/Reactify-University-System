import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/DegreesList.css';

function DegreesList() {
    const [degrees, setDegrees] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/degree/')
            .then(response => response.json())
            .then(data => {
                // Sort the degrees by full_name in alphabetical order
                const sortedDegrees = data.sort((a, b) => a.full_name.localeCompare(b.full_name));
                setDegrees(sortedDegrees);
            });
    }, []);

    return (
        <div className="container mt-5 degrees-list-container">
            <h1 className="degrees-list-header">Degrees</h1>
            <div className="list-group">
                {degrees.map(degree => (
                    <Link key={degree.shortcode} to={`/degrees/${degree.shortcode}`} className="list-group-item list-group-item-action">
                        {degree.full_name} <span className="badge bg-primary rounded-pill">{degree.shortcode}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DegreesList;
