import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import '../css/CreateCohort.css';

function CreateCohort() {
    const [year, setYear] = useState('');
    const [degreeName, setDegreeName] = useState(null);
    const [degrees, setDegrees] = useState([]);
    const [cohorts, setCohorts] = useState([]);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/degree/')
            .then(response => response.json())
            .then(data => {
                const sortedDegrees = data.sort((a, b) => a.full_name.localeCompare(b.full_name));
                setDegrees(sortedDegrees.map(deg => ({
                    value: deg.shortcode,
                    label: deg.full_name,
                    shortcode: deg.shortcode
                })));
            })
            .catch(error => console.error("Error fetching degrees:", error));

        fetch('http://127.0.0.1:8000/api/cohort/')
            .then(response => response.json())
            .then(data => setCohorts(data))
            .catch(error => console.error("Error fetching cohorts:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        if (!degreeName) {
            setMessage('Please select a degree.');
            setIsSubmitting(false);
            return;
        }

        const cohortExists = cohorts.some(cohort => cohort.degree === `http://127.0.0.1:8000/api/degree/${degreeName.shortcode}/` && cohort.year === Number(year));
        if (cohortExists) {
            setMessage('This cohort for this degree already exists.');
            setIsSubmitting(false);
            return;
        }

        const id = `${degreeName.shortcode}${year}`;
        const cohortName = `Year ${year} ${degreeName.label}`;

        fetch('http://127.0.0.1:8000/api/cohort/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, year: Number(year), degree: `http://127.0.0.1:8000/api/degree/${degreeName.shortcode}/`, name: cohortName }),
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to create the cohort. Please try again.'))
        .then(data => {
            setMessage('Cohort created successfully!');
            navigate(`/cohorts/${data.id}`);
        })
        .catch(error => {
            console.error("Error creating cohort:", error);
            setMessage(`Failed to create the cohort: ${error.toString()}`);
        })
        .finally(() => setIsSubmitting(false));
    };

    return (
        <div className="create-cohort-content">
            <div className="form-container">
                <h1 className="form-header">Create a New Cohort</h1>
                {message && <Alert color="info">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for="degreeName">Degree:</Label>
                        <Select
                            id="degreeName"
                            options={degrees}
                            onChange={option => setDegreeName(option)}
                            value={degreeName}
                            placeholder="Select a degree"
                            isClearable
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="year">Year:</Label>
                        <Input
                            type="number"
                            name="year"
                            id="year"
                            placeholder="Enter cohort year (must be between 1-4 inclusive)"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            min="1"
                            max="4"
                            required
                        />
                    </FormGroup>
                    <Button type="submit" color="primary" disabled={isSubmitting}>Create Cohort</Button>
                </Form>
            </div>
        </div>
    );
}

export default CreateCohort;
