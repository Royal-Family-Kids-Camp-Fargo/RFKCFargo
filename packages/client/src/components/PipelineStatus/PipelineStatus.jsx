import { Card } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import UserStatus from '../UserStatus/UserStatus';
import useStore from '../../zustand/store';

import { DRAG_TYPE } from '../Pipeline/Pipeline';
import './PipelineStatus.css';
export default function PipelineStatus({ status, pipelineId }) {
  const moveUserOnPipeline = useStore((state) => state.moveUserOnPipeline);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: DRAG_TYPE,
    // Props to collect
    drop: (item, monitor) => {
      console.log('item', item);
      console.log('monitor', monitor);
      dropUserIntoPipelineStatus(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const dropUserIntoPipelineStatus = (item) => {
    const moveMe = {
      pipeline_status_id: status.pipeline_status_id,
      user_id: item.id,
      pipeline_id: pipelineId,
    };
    moveUserOnPipeline(moveMe);
  };

  return (
    <Card className='pipeline-status-card'>
      <Card.Body ref={drop} style={{ backgroundColor: isOver ? '#f0f0f0' : 'white' }}>
        {status?.user_collection?.map((person) => (
          <UserStatus key={person.id} person={person} />
        ))}
      </Card.Body>
    </Card>
  );
}
