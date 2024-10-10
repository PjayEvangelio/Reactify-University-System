import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../css/StudentDetail.css';

function StudentDetail() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const fetchStudentAndModules = async () => {
      try {
        const studentResponse = await fetch(`http://127.0.0.1:8000/api/student/${studentId}/`);
        if (!studentResponse.ok) throw new Error('Student not found');
        const studentData = await studentResponse.json();
        setStudent(studentData);
        
        const cohortUrlSegments = studentData.cohort.split('/');
        const cohortId = cohortUrlSegments[cohortUrlSegments.length - 2];
        
        const modulesResponse = await fetch(`http://127.0.0.1:8000/api/module/?delivered_to=${cohortId}`);
        if (!modulesResponse.ok) throw new Error('Error fetching modules');
        const modulesData = await modulesResponse.json();
        modulesData.sort((a, b) => a.full_name.localeCompare(b.full_name));
        setModules(modulesData);
        
        const gradesResponse = await fetch(`http://127.0.0.1:8000/api/grade/?student=${studentId}`);
        if (!gradesResponse.ok) throw new Error('Error fetching grades');
        const gradesData = await gradesResponse.json();
        setGrades(gradesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentAndModules();
  }, [studentId]);

  if (isLoading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error: {error}
          <Button color="primary" onClick={() => navigate('/')} className="btn btn-primary mt-3">
            Back to Home
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-detail-container">
      <div className="header-section">
        <h1>Student Details</h1>
        <div className="student-info">
          <p className="info-item"><span className="info-label">Full Name:</span> {student?.first_name} {student?.last_name}</p>
          <p className="info-item"><span className="info-label">Student Number:</span> {student?.student_id}</p>
          <p className="info-item email-info"><span className="info-label">Email:</span> {student?.email}</p>
        </div>
      </div>
      <h2>Grades for Registered Modules</h2>
      {modules.length > 0 ? (
        <>
          <div className="note-display">Module grades have been rounded up/down where deemed appropriate</div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Module</th>
                <th>CA Mark</th>
                <th>Final Exam Mark</th>
                <th>Total Grade</th>
                <th>Change Grade</th>
              </tr>
            </thead>
            <tbody>
              {modules.map(module => {
                const grade = grades.find(g => g.module.endsWith(module.code + '/'));
                return (
                  <tr key={module.code}>
                    <td>
                      <Link to={`/modules/${module.code}`} className="module-link">
                        {module.code} - {module.full_name}
                      </Link>
                    </td>
                    <td>{grade ? grade.ca_mark : 'N/A'}</td>
                    <td>{grade ? grade.exam_mark : 'N/A'}</td>
                    <td>{grade ? Math.round(grade.total_grade) : 'N/A'}</td>
                    <td>
                      <Link to="/set-grades" className="set-grade-link">
                        Set/Update Grade
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ul className="list-group list-group-flush">
            <li className="list-group-item explanation">Note: 'N/A' indicates that the student has no grades for the corresponding module at the moment.</li>
          </ul>
        </>
      ) : (
        <ul className="list-group list-group-flush">
          <li className="list-group-item">This student's cohort does not have any registered modules at the moment.</li>
        </ul>
      )}
    </div>
  );
}

export default StudentDetail;
