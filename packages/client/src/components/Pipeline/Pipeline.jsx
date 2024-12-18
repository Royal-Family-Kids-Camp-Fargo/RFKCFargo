import { useState, useEffect } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

import useStore from '../../zustand/store';
import PipelineStatus from '../PipelineStatus/PipelineStatus';
import PipelineForm from '../PipelineForm/PipelineForm';

import './Pipeline.css';
import AddUserToPipeline from './AddUserToPipeline';
import { useQuery } from '@tanstack/react-query';
import pipelineApi from '../../api/pipelines';
import pipelineStatusApi from '../../api/pipelineStatuses';

export const DRAG_TYPE = 'user-status';

export default function Pipeline() {
  const { pipelineId: urlPipelineId } = useParams();
  const { data: pipeline, isLoading, error } = useQuery({
    queryKey: ['pipeline'],
    queryFn: () => pipelineApi.get(urlPipelineId, null)
  });
  const { data: pipelineStatuses, isLoading: pipelineStatusesLoading, error: pipelineStatusesError } = useQuery({
    queryKey: ['pipelineStatuses'],
    queryFn: () => pipelineStatusApi.getAll({ filter: `pipeline_id = ${urlPipelineId}` })
  });
  const addBotContext = useStore((state) => state.addBotContext);
  const removeBotContext = useStore((state) => state.removeBotContext);

  useEffect(() => {
    addBotContext(`User is looking at pipeline with id ${urlPipelineId}`);
    return () => {
      removeBotContext(`User is looking at pipeline with id ${urlPipelineId}`);
    };
  }, [urlPipelineId]);

  console.log('pipelineStatuses', pipelineStatuses);
  console.log('pipeline', pipeline);

  // Get the initial status id for the pipeline if it exists
  let initialPipelineStatusId = null;
  if (pipeline?.statuses?.length > 0) {
    initialPipelineStatusId = pipeline.statuses[0].pipeline_status_id;
  }

  return (
    <>
      <div>
        <div className='text-center mb-4'>
          <h1 style={{ color: '#4b0082' }}>
            {pipeline?.name
              ? `${pipeline.name} Pipeline`
              : 'Pipeline'}
          </h1>
        </div>
        {/* <div className='input-group mb-4'>
          <select
            id='pipelines'
            className='form-control'
            value={pipelineId}
            onChange={(event) => setPipelineId(Number(event.target.value))}
          >
            <option value="">Select Pipeline</option>
            {pipelines.data.map((pipeline) => (
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
          {/* <PipelineForm /> */}
        {/* </div> */} 
        {initialPipelineStatusId && (
          <AddUserToPipeline pipelineId={pipelineId} initialPipelineStatusId={initialPipelineStatusId} />
        )}
      </div>

      {/* Display the pipeline statuses, if we haven't selected a pipeline ask the user to select one */}
      {!pipeline ? (
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
            {pipeline ? (
              pipelineStatuses?.data?.length > 0 ? (
                pipelineStatuses.data.map((status) => (
                  <div key={status.id} className='pipeline-status'>
                    <h3 className='text-center pipeline-status-title'>{status.name}</h3>
                    <PipelineStatus status={status} pipelineId={pipeline.id} />
                  </div>
                ))
              ) : (
                <div className='text-center mt-4'>
                  <p>No statuses found. Please add statuses to this pipeline.</p>
                </div>
              )
            ) : null}
          </div>
        </DndProvider>
      )}
    </>
  );
}
