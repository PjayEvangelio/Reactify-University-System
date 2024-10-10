import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../css/CohortDetail.css';

function CohortDetail() {
    const { cohortId } = useParams();
    const [cohort, setCohort] = useState(null);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        const fetchCohortDetails = async () => {
            try {
                const cohortResponse = await fetch(`http://127.0.0.1:8000/api/cohort/${cohortId}/`);
                if (!cohortResponse.ok) {
                    throw new Error('Cohort not found');
                }
                const cohortData = await cohortResponse.json();
                setCohort(cohortData);

                const studentsResponse = await fetch(`http://127.0.0.1:8000/api/student/?cohort=${cohortId}`);
                if (!studentsResponse.ok) {
                    throw new Error('Error fetching students');
                }
                const studentsData = await studentsResponse.json();
                setStudents(studentsData.sort((a, b) => parseInt(a.student_id) - parseInt(b.student_id)));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCohortDetails();
    }, [cohortId]);

    if (isLoading) {
        return <div className="container mt-5">Loading cohort details...</div>;
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    Error: {error}
                    <div className="mt-3">
                        <Button color="primary" onClick={() => navigate('/cohorts')} className="btn btn-primary">
                            Back to Cohorts
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cohort-detail-container">
            <div className="header-container">
                <h1>{cohort ? cohort.name : 'Cohort not found'}</h1>
                <Link to={`/modules-cohort/${cohortId}`} className="btn btn-outline-primary">View Modules for {cohortId}</Link>
            </div>
            {students.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Student Number</th>
                            <th scope="col">Student Name</th>
                            <th scope="col">Student Email</th>
                            <th scope="col">Student Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.student_id}>
                                <td>{student.student_id}</td>
                                <td>{student.first_name} {student.last_name}</td>
                                <td>{student.email}</td>
                                <td>
                                    <Link to={`/students/${student.student_id}`}>View Student Details</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">This cohort does not have any students at the moment.</li>
                </ul>
            )}
        </div>
    );
}

export default CohortDetail;
