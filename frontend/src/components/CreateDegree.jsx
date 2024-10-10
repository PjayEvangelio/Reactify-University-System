import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import '../css/CreateDegree.css';

function CreateDegree() {
  const [fullName, setFullName] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [degrees, setDegrees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/degree/')
      .then(response => response.json())
      .then(data => setDegrees(data))
      .catch(error => console.error("Error fetching degrees:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const fullNameExists = degrees.some(degree => degree.full_name === fullName);
    const shortcodeExists = degrees.some(degree => degree.shortcode === shortcode);

    if (fullNameExists) {
      setMessage('A degree with this full name already exists.');
      setIsSubmitting(false);
      return;
    }

    if (shortcodeExists) {
      setMessage('A degree with this shortcode already exists.');
      setIsSubmitting(false);
      return;
    }

    fetch('http://127.0.0.1:8000/api/degree/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, shortcode: shortcode }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to create the degree. Please try again.');
      return response.json();
    })
    .then((data) => {
      setMessage('Degree created successfully!');
      // Navigate to the new degree page
      navigate(`/degrees/${data.shortcode}`);
    })
    .catch(error => {
      setMessage(error.message);
    })
    .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="create-degree-content">
      <div className="form-container">
        <h1 className="form-header">Create a New Degree</h1>
        {message && <Alert color="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="fullName">Full Name:</Label>
            <Input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Enter full name of the degree"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="shortcode">Shortcode:</Label>
            <Input
              type="text"
              name="shortcode"
              id="shortcode"
              placeholder="Enter degree shortcode (maximum of 5 characters)"
              value={shortcode}
              onChange={(e) => setShortcode(e.target.value)}
              maxLength={5}
              required
            />
          </FormGroup>
          <Button type="submit" color="primary" disabled={isSubmitting}>Create Degree</Button>
        </Form>
      </div>
    </div>
  );
}

export default CreateDegree;
