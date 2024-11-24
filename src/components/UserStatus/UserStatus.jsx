import { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { useDrag } from 'react-dnd';
import useStore from '../../zustand/store';
import { useNavigate } from 'react-router-dom';

import { DRAG_TYPE } from '../Pipeline/Pipeline';

export default function UserStatus({ person }) {
  const navigate = useNavigate();
  const statuses = useStore((state) => state.selectedPipeline.statuses);
  const mySelectedPipeline = useStore((state) => state.selectedPipeline);
  const deleteUserFromPipeline = useStore((state) => state.deleteUserFromPipeline);
  const moveUserOnPipeline = useStore((state) => state.moveUserOnPipeline);

  const [pipelineStatus, setPipelineStatus] = useState(person.pipeline_status_id);

  // Allow the User Status to be dragged into another Pipeline Status
  const [isDragging, drag, dragPreview] = useDrag(() => ({
    type: DRAG_TYPE,
    item: person,
  }));

  const moveLane = () => {
    if (pipelineStatus) {
      const moveMe = {
        pipeline_status_id: pipelineStatus,
        user_id: person.id,
        pipeline_id: mySelectedPipeline.pipeline_id,
      };
      moveUserOnPipeline(moveMe);
    } else {
      alert('Please select a status');
    }
  };

  const removeUser = () => {
    const removeMe = {
      user_id: person.id,
      pipeline_status_id: person.pipeline_status_id,
      pipeline_id: mySelectedPipeline.pipeline_id,
    };
    deleteUserFromPipeline(removeMe);
  };

  const moveToProfile = () => {
    navigate(`/profile/${person.id}`);
  };

  const moveLaneWithoutSubmit = (event) => {
    event.preventDefault();
    const pipelineStatus = event.target.value;
    if (pipelineStatus) {
      const moveMe = {
        pipeline_status_id: pipelineStatus,
        user_id: person.id,
        pipeline_id: mySelectedPipeline.pipeline_id,
      };
      moveUserOnPipeline(moveMe);
    } else {
      alert('Please select a status');
    }
  };

  if (person.id) {
    return (
      <Card className="mb-3 shadow-sm" ref={dragPreview} style={{ opacity: isDragging ? 1 : 0.5}}>
        <Card.Body ref={drag}>
          <div onClick={moveToProfile} className="mb-3" style={{ cursor: 'pointer' }}>
            <Card.Title>
              {person.user_firstName} {person.user_lastName}
            </Card.Title>
            <Card.Subtitle className="text-muted">{person.phoneNumber}</Card.Subtitle>
          </div>

          <Form>
            <Form.Group as={Row} controlId="PipelineStatus" className="mb-3">
              <Form.Label column sm={4}>
                Status
              </Form.Label>
              <Col sm={8}>
                <Form.Select
                  onChange={moveLaneWithoutSubmit}
                  value={pipelineStatus}
                >
                  <option value="">Select Status</option>
                  {statuses?.map((stat) => (
                    <option key={stat.pipeline_status_id} value={stat.pipeline_status_id} selected={stat.pipeline_status_id.toString() === pipelineStatus.toString()}>
                      {stat.status}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="danger" onClick={removeUser} className="btn-sm">
                Remove
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  } else {
    return (
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Text>No One in Status</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}
