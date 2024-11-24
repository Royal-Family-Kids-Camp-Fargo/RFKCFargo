import { Card } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import UserStatus from '../UserStatus/UserStatus';
import useStore from '../../zustand/store';

import { DRAG_TYPE } from '../Pipeline/Pipeline';

export default function PipelineStatus({ status, pipelineId }) {
  const moveUserOnPipeline = useStore((state) => state.moveUserOnPipeline);


  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: DRAG_TYPE,
    // Props to collect
    drop: (item, monitor) => {
      // This is where you handle the drop
      // You can check the type of item and perform different actions
      // based on the type
      console.log('item', item);
      console.log('monitor', monitor);
      dropUserIntoPipelineStatus(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
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
    <Card>
      <Card.Header>{status.status}</Card.Header>
      <Card.Body ref={drop} style={{ backgroundColor: isOver ? 'red' : 'white'}}>
        {status?.applicants?.map((person) => (
          <UserStatus key={person.id} person={person} />
        ))}
      </Card.Body>
    </Card>
  );
}
