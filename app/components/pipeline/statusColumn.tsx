import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import UserCard from "./userCard";
import type { User } from "~/api/objects/user";
import type { StatusIds } from "./userCard";

import type { PipelineStatus } from "~/api/objects/pipelineStatus";
import type { UserPipelineStatus } from "~/api/objects/userPipelineStatus";
/**
 * Each status column.
 */
export default function StatusColumn({
  status,
  globalSearchTerm,
  statusIds,
  pipelineId,
  userPipelineStatuses,
}: {
  status: PipelineStatus;
  globalSearchTerm: string;
  userPipelineStatuses: UserPipelineStatus[];
  statusIds: StatusIds;
  pipelineId: string;
}) {
  const theme = useTheme();

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!userPipelineStatuses) {
      return [];
    }
    if (!globalSearchTerm) return userPipelineStatuses;

    const term = globalSearchTerm.toLowerCase();
    return userPipelineStatuses.filter(
      (user_pipeline_status: UserPipelineStatus) => {
        return (
          user_pipeline_status.user.first_name?.toLowerCase().includes(term) ||
          user_pipeline_status.user.last_name?.toLowerCase().includes(term) ||
          user_pipeline_status.user.email?.toLowerCase().includes(term)
        );
      }
    );
  }, [userPipelineStatuses, globalSearchTerm]);

  return (
    <Box
      sx={{
        minWidth: { xs: "85vw", sm: "350px" },
        maxWidth: { xs: "85vw", sm: "350px" },
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #dee2e6",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#4b0082",
          borderBottom: "2px solid #20c997",
          pb: 1,
          mb: 2,
          fontSize: { xs: "1rem", sm: "1.25rem" },
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: "bold",
        }}
      >
        <span>{status.name}</span>
        <span style={{ color: "gray", fontSize: "0.9em" }}>
          {userPipelineStatuses.length || 0}
        </span>
      </Typography>
      {filteredUsers.map((user_pipeline_status: UserPipelineStatus) => (
        <UserCard
          key={user_pipeline_status.user.id}
          user={user_pipeline_status.user}
          statusIds={statusIds}
          pipelineId={pipelineId}
        />
      ))}
    </Box>
  );
}
