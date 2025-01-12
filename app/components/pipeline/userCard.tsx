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

  const { mutate: movePipelineStatusBackward } = useMutation({
    mutationFn: (statusIds: StatusIds) =>
      userPipelineStatusApi.movePipelineStatus(
        user.id,
        pipelineId,
        statusIds.previousStatusId
      ),
    onSuccess: (data: any) => {
      console.log("onSuccess backward");
      queryClient.setQueryData(["pipelineStatuses"], (oldData: any) => {
        try {
          const newData = {
            ...oldData,
            [data.user_id]: data,
          };
          return newData;
        } catch (error) {
          console.error("Error updating pipeline statuses", error);
          return oldData;
        }
      });
    },
  });

  const { mutate: movePipelineStatusForward } = useMutation({
    mutationFn: (statusIds: StatusIds) =>
      userPipelineStatusApi.movePipelineStatus(
        user.id,
        pipelineId,
        statusIds.nextStatusId
      ),
    onSuccess: (data: any) => {
      console.log("onSuccess forward", data);
      queryClient.setQueryData(["pipelineStatuses"], (oldData: any) => {
        try {
          const newData = {
            ...oldData,
            [data.user_id]: data,
          };
          return newData;
        } catch (error) {
          console.error("Error updating pipeline statuses", error);
          return oldData;
        }
      });
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
          <ArrowBackIcon
            sx={{
              mr: 1,
              cursor: "pointer",
              display: statusIds.previousStatusId ? "block" : "none",
            }}
            onClick={() => movePipelineStatusBackward(statusIds)}
          />
          <ArrowForwardIcon
            sx={{
              ml: 1,
              cursor: "pointer",
              display: statusIds.nextStatusId ? "block" : "none",
            }}
            onClick={() => movePipelineStatusForward(statusIds)}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
