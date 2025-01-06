import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import pipelineApi from "~/api/objects/pipeline";
import pipelineStatusApi from "~/api/objects/pipelineStatus";
import { botContextStore } from "~/stores/botContextStore";
import type { Route } from "../+types/dashboard";

interface UserItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

/**
 * UserCard component.
 */
function UserCard({ user }: { user: UserItem }) {
  return (
    <Paper
      elevation={1}
      sx={{
        mb: 1,
        p: 1,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {user.first_name || user.last_name
          ? `${user.first_name} ${user.last_name}`
          : "No Name"}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {user.email}
      </Typography>
    </Paper>
  );
}

/**
 * Each status column.
 */
function StatusColumn({
  status,
  globalSearchTerm,
}: {
  status: any;
  globalSearchTerm: string;
}) {
  const theme = useTheme();

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!status.user_collection || !Array.isArray(status.user_collection)) {
      return [];
    }
    if (!globalSearchTerm) return status.user_collection;

    const term = globalSearchTerm.toLowerCase();
    return status.user_collection.filter((user: UserItem) => {
      return (
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    });
  }, [status.user_collection, globalSearchTerm]);

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
        {status.name}
      </Typography>
      {filteredUsers.map((user: UserItem) => (
        <UserCard key={user.id} user={user} />
      ))}
    </Box>
  );
}

// Define the loader function
export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
  const { pipelineId } = params;
  if (!pipelineId) {
    throw new Error("Pipeline ID is required");
  }

  const pipelineStatuses = await pipelineStatusApi.getAll({
    filter: `pipeline_id = ${pipelineId}`,
    limit: 25,
    offset: 0,
    ordering: "created_at",
  });

  return { pipelineStatuses: pipelineStatuses.data };
};

export default function ViewPipeline() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { pipelineId } = useParams();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Track ephemeral board state (e.g., statuses with user arrays).
  const [boardData, setBoardData] = useState<any[]>([]);

  // Fetch pipeline data
  const {
    data: pipeline,
    isLoading: pipelineLoading,
    error: pipelineError,
  } = useQuery({
    queryKey: ["pipeline", pipelineId],
    queryFn: () => pipelineApi.get(pipelineId as string, null),
    enabled: !!pipelineId,
  });

  // Fetch statuses for pipeline
  const {
    data: pipelineStatuses,
    isLoading: statusesLoading,
    error: statusesError,
    isSuccess: statusesSuccess,
  } = useQuery({
    queryKey: ["pipelineStatuses", pipelineId],
    queryFn: async () => {
      const res = await pipelineStatusApi.getAll({
        filter: `pipeline_id = ${pipelineId}`,
        limit: 25,
        offset: 0,
        ordering: "created_at",
      });
      return res.data || [];
    },
    enabled: !!pipelineId,
  });

  // Update boardData when query is successful
  useEffect(() => {
    if (statusesSuccess && pipelineStatuses) {
      setBoardData(pipelineStatuses);
    }
  }, [statusesSuccess, pipelineStatuses]);

  // For adding more context to your AI store
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;
  useEffect(() => {
    if (pipelineId) {
      addBotContext(`User is viewing pipeline with ID ${pipelineId}`);
      return () => {
        removeBotContext(`User is viewing pipeline with ID ${pipelineId}`);
      };
    }
  }, [pipelineId]);

  const handleSearchChange = (value: string) => {
    setGlobalSearchTerm(value.toLowerCase());
  };

  let initialPipelineStatusId = null;
  if (boardData.length > 0) {
    initialPipelineStatusId = boardData[0].id;
  }

  if (pipelineLoading || statusesLoading) {
    return (
      <Container>
        <Typography>Loading pipeline data...</Typography>
      </Container>
    );
  }

  if (pipelineError || statusesError) {
    return (
      <Container>
        <Typography color="error">Error loading pipeline or statuses.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ width: "100vw", height: "100vh", pb: 0 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#4b0082",
            fontSize: { xs: "1.5rem", sm: "2.125rem" },
          }}
        >
          {pipeline?.name ? `${pipeline.name} Pipeline` : "Pipeline"}
        </Typography>
      </Box>

      {/* Search input */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search users by name or email..."
        onChange={(e) => handleSearchChange(e.target.value)}
        sx={{
          mb: 2,
          "& .MuiInputBase-root": {
            fontSize: { xs: "0.875rem", sm: "1rem" },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Button for adding new users to the pipeline */}
      {/* {initialPipelineStatusId && (
        <AddUserToPipeline
          pipelineId={pipelineId as string}
          initialPipelineStatusId={initialPipelineStatusId}
        />
      )} */}

      {/* The Kanban board */}
      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          mt: 2,
          pb: 2,
          WebkitOverflowScrolling: "touch",
          backgroundColor: theme.palette.background.paper,
          "&::-webkit-scrollbar": {
            height: 8,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: 4,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.3)",
            },
          },
        }}
      >
        {boardData && boardData.length > 0 ? (
          boardData.map((status: any) => (
            <StatusColumn
              key={status.id}
              status={status}
              globalSearchTerm={globalSearchTerm}
            />
          ))
        ) : (
          <Box sx={{ textAlign: "center", mt: 4, width: "100%" }}>
            <Typography sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>
              No statuses found. Please add statuses to this pipeline.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}