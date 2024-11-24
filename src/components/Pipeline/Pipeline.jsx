import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

import './Pipeline.css'; // Assuming the styles are in this file

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const selectedPipelineWithData = useStore((state) => state.selectedPipeline);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);
  const foundUsers = useStore((state) => state.foundUsers);
  const searchingApplicant = useStore((state) => state.searchingApplicant);
  const setSelectedUserId = useStore((state) => state.setSelectedUserId);
  const selectedUserId = useStore((state) => state.selectedUserId);
  const addUserStatus = useStore((state) => state.addUserStatus);

  const [pipelineId, setPipelineId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    fetchPipeline();
  }, [fetchPipeline]);

  const loadPipeline = () => {
    fetchPipelineById(pipelineId);
  };

  const searchQuery = () => {
    searchingApplicant(searchString);
  };

  const addUserToPipeline = () => {
    if (!selectedPipelineWithData || Object.keys(selectedPipelineWithData).length === 0) {
      alert('Please select a pipeline');
      return;
    }

    const newUserStatus = {
      pipeline_id: selectedPipelineWithData.pipeline_id,
      user_id: selectedUserId,
      pipeline_status_id: selectedPipelineWithData.statuses[0].pipeline_status_id,
    };
    addUserStatus(newUserStatus);
    setSearchString('');
  };

  return (
    <>
      {/* Other controls */}
      <div>
        <h1>Pipeline Page</h1>
        <div>
          <label htmlFor="pipelines">Choose Pipeline</label>
          <select value={pipelineId} onChange={(event) => setPipelineId(Number(event.target.value))}>
            <option>Select Pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          <button onClick={loadPipeline}>Load Pipeline</button>
        </div>
      </div>

      <div className="horizontal-scroll">
        {selectedPipelineWithData?.statuses?.map((status) => (
          <div key={status.pipeline_status_id} className="pipeline-status">
            <h3>{status.status}</h3>
            <PipelineStatus status={status} />
          </div>
        ))}
      </div>

      {showModal && <PipelineForm setShowModal={setShowModal} />}
    </>
  );
}
