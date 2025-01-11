import {
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { User } from "~/api/objects/user";
import userPipelineStatusApi from "~/api/objects/userPipelineStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type StatusIds = {
  previousStatusId: string | null;
  currentStatusId: string;
  nextStatusId: string | null;
};
/**
 * UserCard component.
 */
export default function UserCard({
  user,
  statusIds,
  pipelineId,
}: {
  user: User;
  statusIds: StatusIds;
  pipelineId: string;
}) {
  const queryClient = useQueryClient();
  console.log("pipelineId", pipelineId);

  const { mutate: movePipelineStatusBackward } = useMutation({
    mutationFn: (statusIds: StatusIds) =>
      userPipelineStatusApi.movePipelineStatus(
        user.id,
        pipelineId,
        statusIds.previousStatusId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelineStatuses"] });
    },
  });

  const { mutate: movePipelineStatusForward } = useMutation({
    mutationFn: (statusIds: StatusIds) =>
      userPipelineStatusApi.movePipelineStatus(
        user.id,
        pipelineId,
        statusIds.nextStatusId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipelineStatuses"] });
    },
  });

  return (
    <Accordion
      elevation={1}
      sx={{
        mb: 1,
        p: 1,
        backgroundColor: "#f8f9fa",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {user.first_name || user.last_name
            ? `${user.first_name} ${user.last_name}`
            : "No Name"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" color="textSecondary">
          {user.email}
        </Typography>
        <Typography variant="body2">
          {user.phone_number || "No Phone"}
        </Typography>
        <Typography variant="body2">
          Assigned to: {user.assigned_to?.first_name || "No Assignment"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          {statusIds.previousStatusId && (
            <ArrowBackIcon
              sx={{ mr: 1, cursor: "pointer" }}
              onClick={() => movePipelineStatusBackward(statusIds)}
            />
          )}
          {statusIds.nextStatusId && (
            <ArrowForwardIcon
              sx={{ ml: 1, cursor: "pointer" }}
              onClick={() => movePipelineStatusForward(statusIds)}
            />
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
