import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const [pipeline, setPipeline] = useState('');

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const ChoosePipeline = (event) => {
    event.preventDefault();

    //  dispatch({
    //    type: 'NEW_LOG',
    //    payload: {
    //      details: details,
    //    },
    //  });
    //  setPipeline('');
  };

  //   const fetchPipeline = async () => {
  //     const response = await axios.get('/api/pipeline');
  //     console.log('pipeline response', response.data);
  //     setPipelines(response.data);
  //   };

  return (
    <>
      <div>
        <h1>Pipeline page!</h1>;<p>{pipelines?.length > 0 && JSON.stringify(pipelines)}</p>
      </div>
      <div>
        <label for='pipelines'>Choose pipeline</label>
        <select value={pipeline} onChange={(event) => setPipeline(event.target.value)}>
          {pipelines.map((pipeline) => (
            <option key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
