import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../css/DegreeDetail.css';

function DegreeDetail() {
    const { shortcode } = useParams();
    const [degree, setDegree] = useState(null);
    const [cohorts, setCohorts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        const fetchDegreeDetails = async () => {
            try {
                const degreeResponse = await fetch(`http://127.0.0.1:8000/api/degree/${shortcode}/`);
                if (!degreeResponse.ok) throw new Error('Degree not found');
                const degreeData = await degreeResponse.json();
                setDegree(degreeData);

                const cohortsResponse = await fetch(`http://127.0.0.1:8000/api/cohort/?degree=${shortcode}`);
                if (!cohortsResponse.ok) throw new Error('Error fetching cohorts');
                let cohortsData = await cohortsResponse.json();

                cohortsData.sort((a, b) => a.id.localeCompare(b.id));   // Sort cohorts numerically by year/ID
                setCohorts(cohortsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDegreeDetails();
    }, [shortcode]);

    if (isLoading) {
        return <div className="container mt-5">Loading degree details...</div>;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                    <div className="mt-3">
                        <Button color="primary" onClick={() => navigate('/degrees')} className="btn btn-primary">
                            Back to Degrees
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 degree-detail-container">
            <div className="card">
                <div className="card-body">
                    <h1 className="card-title">{degree?.full_name}</h1>
                    <div className="shortcode-display">
                        Degree Shortcode: {degree?.shortcode}
                    </div>
                    <h2 className="h2-cohorts">Cohorts</h2>
                    <ul className="list-group list-group-flush">
                        {cohorts.length > 0 ? (
                            cohorts.map(cohort => (
                                <li key={cohort.id} className="list-group-item">
                                    {cohort.id} - {cohort.name} {" "}
                                    <span className="view-details-link">
                                        <Link to={`/cohorts/${cohort.id}`}>View Cohort Details</Link>
                                    </span>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">This degree does not have any cohorts at the moment.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default DegreeDetail;
