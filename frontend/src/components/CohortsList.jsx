import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/CohortsList.css';

function CohortsList() {
    const [cohorts, setCohorts] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/cohort/')
            .then(response => response.json())
            .then(data => {
                const sortedCohorts = data.sort((a, b) => {
                    const regex = /(.+)(\d+)/;
                    const splitA = a.name.match(regex);
                    const splitB = b.name.match(regex);

                    // Check if both matches are successful
                    if (splitA && splitB) {
                        const nameCompare = splitA[1].trim().localeCompare(splitB[1].trim());
                        if (nameCompare !== 0) {
                            return nameCompare;
                        }
                        return Number(splitA[2]) - Number(splitB[2]);
                    } else if (splitA && !splitB) {
                        return -1;
                    } else if (!splitA && splitB) {
                        return 1;
                    } else {
                        return a.name.localeCompare(b.name);   // Fallback to simple name comparison
                    }
                });
                setCohorts(sortedCohorts);
            });
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="cohorts-list-header">Cohorts</h1>
            <div className="list-group">
                {cohorts.map(cohort => (
                    <Link key={cohort.pk} to={`/cohorts/${cohort.id}`} className="list-group-item list-group-item-action">
                        {cohort.name} <span className="badge bg-primary rounded-pill">{cohort.id}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CohortsList;
