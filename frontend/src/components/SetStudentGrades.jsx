import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import axios from 'axios';
import '../css/SetStudentGrades.css';

function SetStudentGrades() {
  const [student, setStudent] = useState(null);
  const [moduleId, setModuleId] = useState(null);
  const [caMark, setCaMark] = useState('');
  const [examMark, setExamMark] = useState('');
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [existingGrades, setExistingGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/student/')
      .then(response => {
        const sortedStudents = response.data.sort((a, b) => a.student_id.localeCompare(b.student_id));
        setStudents(sortedStudents.map(student => ({
          value: student.student_id,
          label: `${student.student_id} - ${student.first_name} ${student.last_name}`,
          cohortId: student.cohort.split('/').slice(-2, -1)[0],
        })));
      })
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  useEffect(() => {
    if (student) {
      setIsLoading(true);
      axios.get(`http://127.0.0.1:8000/api/module/?delivered_to=${student.cohortId}`)
        .then(response => {
          const sortedModules = response.data.sort((a, b) => a.full_name.localeCompare(b.full_name));
          setModules(sortedModules.map(module => ({
            value: module.code,
            label: `${module.code} - ${module.full_name}`,   // Sorted and displayed by name
          })));
        })
        .catch(error => console.error('Error fetching modules:', error))
        .finally(() => setIsLoading(false));

      axios.get(`http://127.0.0.1:8000/api/grade/?student=${student.value}`)
        .then(response => {
          setExistingGrades(response.data);
        })
        .catch(error => console.error('Error fetching existing grades:', error));
    } else {
      setModules([]);
      setExistingGrades([]);
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const gradeData = {
      student: `http://127.0.0.1:8000/api/student/${student.value}/`,
      module: `http://127.0.0.1:8000/api/module/${moduleId.value}/`,
      cohort: `http://127.0.0.1:8000/api/cohort/${student.cohortId}/`,
      ca_mark: caMark,
      exam_mark: examMark,
    };

    const existingGrade = existingGrades.find(grade => grade.module.endsWith(`/${moduleId.value}/`));

    if (existingGrade) {
      axios.patch(`http://127.0.0.1:8000/api/grade/${existingGrade.id}/`, gradeData)
        .then(() => {
          setMessage('Grade updated successfully!');
          navigate(`/students/${student.value}`);
        })
        .catch(error => setMessage(`Error updating grade: ${error.message}`))
        .finally(() => setIsLoading(false));
    } else {
      axios.post('http://127.0.0.1:8000/api/grade/', gradeData)
        .then(() => {
          setMessage('Grade created successfully!');
          navigate(`/students/${student.value}`);
        })
        .catch(error => setMessage(`Error creating grade: ${error.message}`))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="create-grade-content">
      <div className="form-container">
        <h1 className="form-header">Set Student Grades</h1>
        {message && <Alert color="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="studentId">Student ID & Name:</Label>
            <Select
              id="studentId"
              options={students}
              onChange={option => setStudent(option)}
              placeholder="Select a student"
              value={student}
              isClearable
            />
          </FormGroup>
          <FormGroup>
            <Label for="moduleId">Module Code:</Label>
            <Select
              id="moduleId"
              options={modules}
              onChange={option => setModuleId(option)}
              placeholder="Select a module"
              value={moduleId}
              isClearable
            />
          </FormGroup>
          <FormGroup>
            <Label for="caMark">CA Mark:</Label>
            <Input
              type="number"
              name="caMark"
              id="caMark"
              value={caMark}
              onChange={e => setCaMark(e.target.value)}
              min="0"
              max="100"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="examMark">Exam Mark:</Label>
            <Input
              type="number"
              name="examMark"
              id="examMark"
              value={examMark}
              onChange={e => setExamMark(e.target.value)}
              min="0"
              max="100"
              required
            />
          </FormGroup>
          <Button type="submit" color="primary" disabled={isLoading}>Set Module Grade</Button>
        </Form>
      </div>
    </div>
  );
}

export default SetStudentGrades;
