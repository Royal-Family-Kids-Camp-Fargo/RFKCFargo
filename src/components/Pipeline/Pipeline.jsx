import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Pipeline() {
  const [pipelines, setPipelines] = useState([]);

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    const response = await axios.get('/api/pipeline');
    console.log('pipeline response', response.data);
    setPipelines(response.data);
  };

  return (
    <div>
      <h1>Pipeline page!</h1>;<p>{JSON.stringify(pipelines)}</p>
    </div>
  );
}
