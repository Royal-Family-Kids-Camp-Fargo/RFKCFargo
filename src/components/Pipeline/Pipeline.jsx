import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const selectedPipelineWithData = useStore((state) => state.selectedPipeline);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);
  const [pipelineId, setPipelineId] = useState('');

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const loadPipeline = () => {
    fetchPipelineById(pipelineId);
  };


  return (
    <>
      <div>
        <h1>Pipeline page!</h1>;<p>{pipelines?.length > 0 && JSON.stringify(pipelines)}</p>
      </div>
      <div>
        <label htmlFor='pipelines'>Choose pipeline</label>
        <select value={pipelineId} onChange={(event) => setPipelineId(event.target.value)}>
          {pipelines.map((pipeline) => (
            <option key={pipeline.id} value={pipeline.id}>
              {pipeline.name}
            </option>
          ))}
        </select>
        <button onClick={loadPipeline}>Load Pipeline</button>
      </div>
      <div>
        {JSON.stringify(selectedPipelineWithData)}
      </div>
    </>
  );
}
