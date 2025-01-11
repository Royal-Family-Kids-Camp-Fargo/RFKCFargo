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
}: {
  status: PipelineStatus;
  globalSearchTerm: string;
  statusIds: StatusIds;
  pipelineId: string;
}) {
  const theme = useTheme();

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (
      !status.user_pipeline_status_collection ||
      !Array.isArray(status.user_pipeline_status_collection)
    ) {
      return [];
    }
    if (!globalSearchTerm) return status.user_pipeline_status_collection;

    const term = globalSearchTerm.toLowerCase();
    return status.user_pipeline_status_collection.filter(
      (user_pipeline_status: UserPipelineStatus) => {
        return (
          user_pipeline_status.user.first_name?.toLowerCase().includes(term) ||
          user_pipeline_status.user.last_name?.toLowerCase().includes(term) ||
          user_pipeline_status.user.email?.toLowerCase().includes(term)
        );
      }
    );
  }, [status.user_pipeline_status_collection, globalSearchTerm]);

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
          {status.user_pipeline_status_collection.length || 0}
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
