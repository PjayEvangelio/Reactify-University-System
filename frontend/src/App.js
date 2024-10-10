import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import HomePage from './components/HomePage';
import DegreesList from './components/DegreesList';
import DegreeDetail from './components/DegreeDetail';
import CreateDegree from './components/CreateDegree';
import CohortsList from './components/CohortsList';
import CohortDetail from './components/CohortDetail';
import CreateCohort from './components/CreateCohort';
import ModulesList from './components/ModulesList';
import ModuleDetail from './components/ModuleDetail';
import ModulesByCohort from './components/ModulesByCohort';
import CreateModule from './components/CreateModule';
import StudentDetail from './components/StudentDetail';
import CreateStudent from './components/CreateStudent';
import SetGrade from './components/SetStudentGrades';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        Error 404 - Page Not Found
        <div className="mt-3">
          <Button color="primary" onClick={() => navigate('/')} className="btn btn-primary">
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Reactify</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/degrees">Degrees</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-degree">Create Degree</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cohorts">Cohorts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-cohort">Create Cohort</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/modules">Modules</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-module">Create Module</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-student">Create Student</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/set-grades">Set Grades</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/degrees" element={<DegreesList />} />
            <Route path="/degrees/:shortcode" element={<DegreeDetail />} />
            <Route path="/create-degree" element={<CreateDegree />} />
            <Route path="/cohorts" element={<CohortsList />} />
            <Route path="/cohorts/:cohortId" element={<CohortDetail />} />
            <Route path="/create-cohort" element={<CreateCohort />} />
            <Route path="/modules" element={<ModulesList />} />
            <Route path="/modules/:code" element={<ModuleDetail />} />
            <Route path="/modules-cohort/:cohortId" element={<ModulesByCohort />} />
            <Route path="/create-module" element={<CreateModule />} />
            <Route path="/students/:studentId" element={<StudentDetail />} />
            <Route path="/create-student" element={<CreateStudent />} />
            <Route path="/set-grades" element={<SetGrade />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer py-3 bg-light">
          <div className="container text-center">
            <span className="text-muted">Copyright &copy; 2024 Reactify - Patrick John Evangelio</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
