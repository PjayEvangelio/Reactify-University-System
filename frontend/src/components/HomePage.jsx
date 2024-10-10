import React from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Reactify University System</h1>
        <p>Your one-stop portal for managing university resources.</p>
      </header>
      <section className="home-content">
        <div className="content-block">
          <h2>About Us</h2>
          <p>
            At Reactify University, we provide top-notch education and resources
            for our students to excel in their academic pursuits.
          </p>
        </div>
        <div className="content-block button-container">
          <h2>Explore</h2>
          <p>Choose a category to get started:</p>
          <Button color="primary" className="left-button" onClick={() => handleRedirect('/degrees')}>Degrees</Button>
          <Button color="primary" className="middle-button" onClick={() => handleRedirect('/cohorts')}>Cohorts</Button>
          <Button color="primary" className="right-button" onClick={() => handleRedirect('/modules')}>Modules</Button>
        </div>
        <div className="content-block">
          <h2>Contact Us</h2>
          <p>Get in touch with our administration for any inquiries.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
