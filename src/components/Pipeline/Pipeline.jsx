import { useState, useEffect } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

import './Pipeline.css'; // Assuming the styles are in this file
import AddUserToPipeline from './AddUserToPipeline';

export const DRAG_TYPE = 'user-status';

export default function Pipeline() {
  const pipelines = useStore((state) => state.pipelines);
  const selectedPipelineWithData = useStore((state) => state.selectedPipeline);
  const fetchPipeline = useStore((state) => state.fetchPipeline);
  const fetchPipelineById = useStore((state) => state.fetchPipelineById);

  const [pipelineId, setPipelineId] = useState(selectedPipelineWithData.pipeline_id || '');
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
        <div className='text-center mb-4'>
          <h1 style={{ color: '#4b0082' }}>
            {selectedPipelineWithData?.pipeline_name
              ? `${selectedPipelineWithData.pipeline_name} Pipeline`
              : 'Pipeline'}
          </h1>
        </div>
        <div className='input-group mb-4'>
          <select
            id='pipelines'
            className='form-control'
            value={selectedPipelineWithData.pipeline_id ?? pipelineId}
            onChange={(event) => setPipelineId(Number(event.target.value))}
          >
            <option>Select Pipeline</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </select>
          <Button
            onClick={loadPipeline}
            variant='outline-secondary'
            className='px-4'
            style={{
              borderColor: '#4b0082',
              color: '#4b0082',
            }}
          >
            Load Pipeline
          </Button>
          <PipelineForm />
        </div>
        {initialPipelineStatusId && (
          <AddUserToPipeline pipelineId={pipelineId} initialPipelineStatusId={initialPipelineStatusId} />
        )}
      </div>

      {/* Display the pipeline statuses, if we haven't selected a pipeline ask the user to select one */}
      {!selectedPipelineWithData || Object.keys(selectedPipelineWithData).length === 0 ? (
        <div className='mt-4'>
          <Card>
            <Card.Body>
              <Card.Title>No Pipeline Selected</Card.Title>
              <Card.Text>Please select a pipeline to view its statuses.</Card.Text>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <div className='horizontal-scroll mt-4'>
            {selectedPipelineWithData?.statuses?.map((status) => (
              <div key={status.pipeline_status_id} className='pipeline-status'>
                <h3 className='text-center pipeline-status-title'>{status.status}</h3>
                <PipelineStatus status={status} pipelineId={pipelineId} />
              </div>
            ))}
          </div>
        </DndProvider>
      )}
    </>
  );
}
