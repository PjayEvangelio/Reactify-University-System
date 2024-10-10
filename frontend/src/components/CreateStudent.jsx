import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import '../css/CreateStudent.css';

function CreateStudent() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [selectedCohort, setSelectedCohort] = useState(null);
    const [cohorts, setCohorts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/cohort/')
            .then(response => response.json())
            .then(data => {
                const sortedCohorts = data.sort((a, b) => a.name.localeCompare(b.name));
                setCohorts(sortedCohorts.map(cohort => ({
                    value: cohort.id,
                    label: cohort.name
                })));
            })
            .catch(error => setError(`Error fetching cohorts: ${error.toString()}`));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!selectedCohort) {
            setError('Please select a cohort.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/student/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    student_id: studentNumber,
                    cohort: `http://127.0.0.1:8000/api/cohort/${selectedCohort.value}/`,
                }),
            });

            if (!response.ok) throw new Error('Failed to create student.');

            navigate(`/students/${studentNumber}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-student-content">
            <div className="form-container">
                <h1 className="form-header">Create a New Student</h1>
                {error && <Alert color="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="firstName">First Name:</Label>
                        <Input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="lastName">Last Name:</Label>
                        <Input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="studentNumber">Student Number:</Label>
                        <Input
                            type="number"
                            id="studentNumber"
                            value={studentNumber}
                            onChange={e => setStudentNumber(e.target.value)}
                            placeholder="Enter student number (maximum of 8 digits)"
                            min="0"
                            max="99999999"
                            maxLength={8}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="cohort">Cohort:</Label>
                        <Select
                            id="cohort"
                            options={cohorts}
                            onChange={setSelectedCohort}
                            value={selectedCohort}
                            placeholder="Select a cohort"
                            isClearable
                        />
                    </FormGroup>
                    <Button type="submit" color="primary" disabled={isLoading}>Create Student</Button>
                </Form>
            </div>
        </div>
    );
}

export default CreateStudent;
