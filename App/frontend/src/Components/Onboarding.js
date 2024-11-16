import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [interests, setInterests] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Pass interests and goals to backend or global state
    navigate('/dashboard'); // Navigate to the main dashboard
  };

  return (
    <div className="onboarding">
      <h2>Tell us about your interests</h2>
      <textarea 
        placeholder="What are you interested in? e.g., building apps, solving problems"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Your career goal, e.g., Software Engineer" 
        value={careerGoal}
        onChange={(e) => setCareerGoal(e.target.value)}
      />
      <button onClick={handleSubmit}>Continue</button>
    </div>
  );
};

export default Onboarding;
