import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../css/ModuleDetail.css'; 

function ModuleDetail() {
    const { code: moduleCode } = useParams();
    const [module, setModule] = useState({});
    const [cohorts, setCohorts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const fetchModuleAndCohorts = async () => {
            try {
                const moduleResponse = await fetch(`http://127.0.0.1:8000/api/module/${moduleCode}/`);
                if (!moduleResponse.ok) throw new Error('Module not found');

                const moduleData = await moduleResponse.json();
                setModule(moduleData);

                const cohortDetails = await Promise.all(moduleData.delivered_to.map(url => 
                    fetch(url).then(resp => resp.json())
                ));

                cohortDetails.sort((a, b) => a.name.localeCompare(b.name));
                setCohorts(cohortDetails);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchModuleAndCohorts();
    }, [moduleCode]);

    if (isLoading) {
        return <div className="container mt-5">Loading module details...</div>;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                    <div className="mt-3">
                        <Button color="primary" onClick={() => navigate('/modules')} className="btn btn-primary">
                            Back to Modules
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 module-detail-container">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">{module.code} - {module.full_name}</h1>
                    <div className="ca-split-display">
                        CA Split: {module.ca_split}%
                    </div>
                    <h2 className="h2-delivered-to">Delivered To</h2>
                    <ul className="list-group list-group-flush">
                        {cohorts.map((cohort, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <span>{cohort.name} ({cohort.id})</span>
                                <Link to={`/cohorts/${cohort.id}`} className="custom-link">View Cohort Details</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ModuleDetail;
