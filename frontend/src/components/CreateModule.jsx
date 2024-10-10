import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import '../css/CreateModule.css';

const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: '#ced4da',
    minHeight: 'calc(1.5em + .75rem + 2px)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#adb5bd',
    },
    fontSize: '1rem',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#007bff' : 'white',
    '&:hover': {
      backgroundColor: '#0056b3',
      color: 'white',
    },
    cursor: 'pointer',
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#007bff',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    ':hover': {
      backgroundColor: '#0056b3',
      color: 'white',
    },
  }),
};

function CreateModule() {
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [caSplit, setCaSplit] = useState('');
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      .catch(error => console.error('Error fetching cohorts:', error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const deliveredToUrls = selectedCohorts.map(cohort => `http://127.0.0.1:8000/api/cohort/${cohort.value}/`);

    const moduleData = {
      code,
      full_name: fullName,
      ca_split: caSplit,
      delivered_to: deliveredToUrls,
    };

    fetch('http://127.0.0.1:8000/api/module/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(moduleData),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create the module.');
      return response.json();
    })
    .then(data => {
      setMessage('Module created successfully!');
      navigate(`/modules/${data.code}`);
    })
    .catch(error => setMessage(error.message))
    .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="create-module-content">
      <div className="form-container">
        <h1 className="form-header">Create a New Module</h1>
        {message && <Alert color="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="fullName">Full Name:</Label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter full name of the module"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="code">Code:</Label>
            <Input
              type="text"
              name="code"
              id="code"
              placeholder="Enter module code (maximum of 5 characters)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={5}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="caSplit">CA Split (%):</Label>
            <Input
              type="number"
              name="caSplit"
              id="caSplit"
              placeholder="Enter CA split percentage"
              value={caSplit}
              onChange={(e) => setCaSplit(e.target.value)}
              min="0"
              max="100"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Cohorts Delivered to:</Label>
            <Select
              isMulti
              name="deliveredTo"
              options={cohorts}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={setSelectedCohorts}
              value={selectedCohorts}
              styles={customSelectStyles}
            />
          </FormGroup>
          <Button type="submit" color="primary" disabled={isSubmitting}>Create Module</Button>
        </Form>
      </div>
    </div>
  );
}

export default CreateModule;
