import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdvisingDashboard = () => {
  const [recommendedMajors, setRecommendedMajors] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Example API call to get recommendations
        const majorsResponse = await axios.get('/api/recommendations/majors');
        const projectsResponse = await axios.get('/api/recommendations/projects');
        const internshipsResponse = await axios.get('/api/recommendations/internships');
        
        setRecommendedMajors(majorsResponse.data);
        setProjectSuggestions(projectsResponse.data);
        setInternships(internshipsResponse.data);
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="dashboard">
      <h2>Your Recommendations</h2>
      
      <section>
        <h3>Majors</h3>
        <ul>
          {recommendedMajors.map((major, index) => (
            <li key={index}>{major}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Project Suggestions</h3>
        <ul>
          {projectSuggestions.map((project, index) => (
            <li key={index}>{project}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Internships</h3>
        <ul>
          {internships.map((internship, index) => (
            <li key={index}>{internship}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdvisingDashboard;
