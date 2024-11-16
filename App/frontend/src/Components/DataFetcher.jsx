import React, { useState } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [universityUrl, setUniversityUrl] = useState('');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.post('/api/fetchData', { url: universityUrl });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  return (
    <div className="data-fetcher">
      <h3>Fetch Curriculum Data</h3>
      <input 
        type="text" 
        placeholder="Enter University URL" 
        value={universityUrl}
        onChange={(e) => setUniversityUrl(e.target.value)}
      />
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default DataFetcher;
