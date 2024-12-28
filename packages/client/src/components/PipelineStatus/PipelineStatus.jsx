import { useDrop } from 'react-dnd';
import { Box, Paper } from '@mui/material';
import UserStatus from '../UserStatus/UserStatus';
import useStore from '../../zustand/store';
import { DRAG_TYPE } from '../Pipeline/Pipeline';

export default function PipelineStatus({ status, pipelineId }) {
  const moveUserOnPipeline = useStore((state) => state.moveUserOnPipeline);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item) => {
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
    <Paper 
      ref={drop}
      elevation={1}
      sx={{
        minHeight: { xs: 'auto', sm: '300px' },
        backgroundColor: isOver ? 'action.hover' : 'background.paper',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        transition: 'background-color 0.2s ease'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {status?.user_collection?.map((person) => (
          <UserStatus key={person.id} person={person} />
        ))}
      </Box>
    </Paper>
  );
}
