import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  console.log('store data', pipelines);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  //   const fetchPipeline = async () => {
  //     const response = await axios.get('/api/pipeline');
  //     console.log('pipeline response', response.data);
  //     setPipelines(response.data);
  //   };

  return (
    <div>
      <h1>Pipeline page!</h1>;<p>{pipelines?.length > 0 && JSON.stringify(pipelines)}</p>
    </div>
  );
}
