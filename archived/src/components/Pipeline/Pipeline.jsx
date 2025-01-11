import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  TextField,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import useStore from "../../zustand/store";
import PipelineStatus from "../PipelineStatus/PipelineStatus";
import PipelineForm from "../PipelineForm/PipelineForm";
import AddUserToPipeline from "./AddUserToPipeline";
import { useQuery } from "@tanstack/react-query";
import pipelineApi from "../../api/pipelines";
import pipelineStatusApi from "../../api/pipelineStatuses";
import KanbanBoard from "../Kanban/KanbanBoard";
export const DRAG_TYPE = "user-status";

export default function Pipeline() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { pipelineId: urlPipelineId } = useParams();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const {
    data: pipeline,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pipeline"],
    queryFn: () => pipelineApi.get(urlPipelineId, null),
  });

  const {
    data: pipelineStatuses,
    isLoading: pipelineStatusesLoading,
    error: pipelineStatusesError,
  } = useQuery({
    queryKey: ["pipelineStatuses"],
    queryFn: () =>
      pipelineStatusApi.getAll({ filter: `pipeline_id = ${urlPipelineId}` }),
  });

  const addBotContext = useStore((state) => state.addBotContext);
  const removeBotContext = useStore((state) => state.removeBotContext);

  useEffect(() => {
    addBotContext(`User is looking at pipeline with id ${urlPipelineId}`);
    return () => {
      removeBotContext(`User is looking at pipeline with id ${urlPipelineId}`);
    };
  }, [urlPipelineId]);

  // Get the initial status id for the pipeline if it exists
  let initialPipelineStatusId = null;
  if (pipeline?.statuses?.length > 0) {
    initialPipelineStatusId = pipeline.statuses[0].pipeline_status_id;
  }

  const handleSearchChange = (value) => {
    setGlobalSearchTerm(value.toLowerCase());
  };

  const filterUsersBySearch = (users) => {
    if (!globalSearchTerm) return users;

    return users.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(globalSearchTerm) ||
        user.last_name?.toLowerCase().includes(globalSearchTerm) ||
        user.email?.toLowerCase().includes(globalSearchTerm)
    );
  };

  return (
    <KanbanBoard />
    // <Container maxWidth={false} sx={{ width: '100vw', height: '100vh', pb: 0, px: { xs: 1, sm: 2 } }}>
    //   <Box sx={{ textAlign: 'center', mb: 4 }}>
    //     <Typography
    //       variant="h4"
    //       sx={{
    //         color: '#4b0082',
    //         fontSize: { xs: '1.5rem', sm: '2.125rem' }
    //       }}
    //     >
    //       {pipeline?.name ? `${pipeline.name} Pipeline` : 'Pipeline'}
    //     </Typography>
    //   </Box>

    //   {pipeline && (
    //     <TextField
    //       fullWidth
    //       size="small"
    //       placeholder="Search users..."
    //       onChange={(e) => handleSearchChange(e.target.value)}
    //       sx={{
    //         mb: 2,
    //         '& .MuiInputBase-root': {
    //           fontSize: { xs: '0.875rem', sm: '1rem' }
    //         }
    //       }}
    //       inputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">
    //             <SearchIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
    //           </InputAdornment>
    //         ),
    //       }}
    //     />
    //   )}

    //   {initialPipelineStatusId && (
    //     <AddUserToPipeline pipelineId={urlPipelineId} initialPipelineStatusId={initialPipelineStatusId} />
    //   )}

    //   {!pipeline ? (
    //     <Paper sx={{ p: 3, mt: 4 }}>
    //       <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
    //         No Pipeline Selected
    //       </Typography>
    //       <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
    //         Please select a pipeline to view its statuses.
    //       </Typography>
    //     </Paper>
    //   ) : (
    //     <DndProvider backend={HTML5Backend}>
    //       <Box
    //         sx={{
    //           display: 'flex',
    //           overflowX: 'auto',
    //           gap: 2,
    //           mt: 4,
    //           pb: 2,
    //           WebkitOverflowScrolling: 'touch',
    //           backgroundColor: theme.palette.background.paper,
    //           '&::-webkit-scrollbar': {
    //             height: 8,
    //           },
    //           '&::-webkit-scrollbar-track': {
    //             backgroundColor: 'rgba(0,0,0,0.1)',
    //             borderRadius: 4,
    //           },
    //           '&::-webkit-scrollbar-thumb': {
    //             backgroundColor: 'rgba(0,0,0,0.2)',
    //             borderRadius: 4,
    //             '&:hover': {
    //               backgroundColor: 'rgba(0,0,0,0.3)',
    //             },
    //           },
    //         }}
    //       >
    //         {pipeline && pipelineStatuses?.data?.length > 0 ? (
    //           pipelineStatuses.data.map((status) => (
    //             <Box
    //               key={status.id}
    //               sx={{
    //                 minWidth: { xs: '85vw', sm: '350px' },
    //                 maxWidth: { xs: '85vw', sm: '350px' },
    //                 backgroundColor: theme.palette.background.paper,
    //                 border: '1px solid #dee2e6',
    //                 borderRadius: 2,
    //                 p: 2,
    //               }}
    //             >
    //               <Typography
    //                 variant="h6"
    //                 sx={{
    //                   color: '#4b0082',
    //                   borderBottom: '2px solid #20c997',
    //                   pb: 1,
    //                   mb: 2,
    //                   fontSize: { xs: '1rem', sm: '1.25rem' },
    //                   textTransform: 'uppercase',
    //                   letterSpacing: 1,
    //                   fontWeight: 'bold',
    //                 }}
    //               >
    //                 {status.name}
    //               </Typography>
    //               <PipelineStatus
    //                 status={{
    //                   ...status,
    //                   user_collection: filterUsersBySearch(status.user_collection || [])
    //                 }}
    //                 pipelineId={pipeline.id}
    //               />
    //             </Box>
    //           ))
    //         ) : (
    //           <Box sx={{ textAlign: 'center', mt: 4, width: '100%' }}>
    //             <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
    //               No statuses found. Please add statuses to this pipeline.
    //             </Typography>
    //           </Box>
    //         )}
    //       </Box>
    //     </DndProvider>
    //   )}
    // </Container>
  );
}
