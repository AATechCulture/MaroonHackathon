import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="homepage">
      <h1>Welcome to AI Academic Advisor</h1>
      <p>Let us help you find your path in academics and career.</p>
      <button onClick={handleGetStarted}>Get Started</button>
    </div>
  );
};

export default HomePage;
