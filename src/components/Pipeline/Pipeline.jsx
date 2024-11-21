import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const selectedPipelineWithData = useStore((state) => state.selectedPipeline);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);

  const [pipelineId, setPipelineId] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const loadPipeline = () => {
    fetchPipelineById(pipelineId);
  };

  return (
    <>
      <div>
        <h1>Pipeline page!</h1>
      </div>
      <button onClick={() => setShowModal(!showModal)}>Show Modal</button>
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
        {/* {JSON.stringify(selectedPipelineWithData)} */}
        {selectedPipelineWithData?.statuses?.length > 0 &&
          selectedPipelineWithData?.statuses?.map((status, index) => (
            <div key={index}>
              {status.status}
              <PipelineStatus status={status} />
            </div>
          ))}
      </div>
      {showModal && (
       
          <PipelineForm setShowModal={setShowModal} />

      )}
    </>
  );
}
