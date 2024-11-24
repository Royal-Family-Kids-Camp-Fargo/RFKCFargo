import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

import './Pipeline.css'; // Assuming the styles are in this file
import AddUserToPipeline from './AddUserToPipeline';

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

  // Get the initial status id for the pipeline if it exists
  let initialPipelineStatusId = null;
  if (selectedPipelineWithData?.statuses?.length > 0) {
    initialPipelineStatusId = selectedPipelineWithData.statuses[0].pipeline_status_id;
  }

  return (
    <>
      {/* Other controls */}
      <div>
        <h1>Pipeline Page</h1>
        <div className="input-group">
          <select id="pipelines" className="form-control" value={pipelineId} onChange={(event) => setPipelineId(Number(event.target.value))}>
            <option>Select Pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          <Button onClick={loadPipeline}>Load Pipeline</Button>
          <PipelineForm />
        </div>
        {initialPipelineStatusId && (
          <AddUserToPipeline
            pipelineId={pipelineId}
            initialPipelineStatusId={initialPipelineStatusId}
          />
          )}
      </div>

      {/* Display the pipeline statuses, if we haven't selected a pipeline ask the user to select one */}
      {(!selectedPipelineWithData || Object.keys(selectedPipelineWithData).length === 0) ? (
        <div className="mt-4">
          <Card>
            <Card.Body>
              <Card.Title>No Pipeline Selected</Card.Title>
              <Card.Text>
                Please select a pipeline to view its statuses.
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <div className="horizontal-scroll mt-4">
          {selectedPipelineWithData?.statuses?.map((status) => (
            <div key={status.pipeline_status_id} className="pipeline-status">
              <h3>{status.status}</h3>
              <PipelineStatus status={status} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
