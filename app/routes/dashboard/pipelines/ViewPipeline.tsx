import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Box,
  Container,
  Typography,
  TextField,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import pipelineApi from "~/api/objects/pipeline";
import type { Pipeline } from "~/api/objects/pipeline";
import pipelineStatusApi from "~/api/objects/pipelineStatus";
import type { PipelineStatus } from "~/api/objects/pipelineStatus";
import { botContextStore } from "~/stores/botContextStore";
import type { Route } from "../+types/dashboard";
import StatusColumn from "~/components/statusColumn";

// Define the loader function
export const clientLoader = async ({ params }: Route.ClientLoaderArgs): Promise<{pipeline: Pipeline, pipelineStatuses: PipelineStatus[]}> => {
  const { pipelineId } = params;
  if (!pipelineId) {
    throw new Error("Pipeline ID is required");
  }

  const [pipelineRes, pipelineStatusesRes] = await Promise.all([
    pipelineApi.get(pipelineId as string, null),
    pipelineStatusApi.getAll({
      filter: `pipeline_id = ${pipelineId}`,
      limit: 25,
      offset: 0,
      ordering: "created_at",
    }),
  ]);

  return { 
    pipeline: pipelineRes.data, 
    pipelineStatuses: pipelineStatusesRes.data 
  };
};

export default function ViewPipeline({loaderData}: {loaderData: any}) {
  const { pipeline, pipelineStatuses } = loaderData as {
    pipeline: Pipeline;
    pipelineStatuses: PipelineStatus[];
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { pipelineId } = useParams();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const queryClient = useQueryClient();
  
  // For adding more context to your AI store
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;

  // Track ephemeral board state (e.g., statuses with user arrays).
  const [boardData, setBoardData] = useState<any[]>([]);

  // Hydrate React Query cache with preloaded data
  useEffect(() => {
    if (pipeline) {
      queryClient.setQueryData(["pipeline", pipelineId], pipeline);
    }
    if (pipelineStatuses) {
      queryClient.setQueryData(["pipelineStatuses", pipelineId], pipelineStatuses);
    }
  }, [pipeline, pipelineStatuses, pipelineId, queryClient]);

  // Now you can use `useQuery` with `initialData` from the cache
  const {
    data: pipelineData,
    isLoading: pipelineLoading,
    error: pipelineError,
  } = useQuery({
    queryKey: ["pipeline", pipelineId],
    queryFn: () => pipelineApi.get(pipelineId as string, null),
    enabled: !!pipelineId,
  });

  const {
    data: pipelineStatusesData,
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
    if (statusesSuccess && pipelineStatusesData) {
      setBoardData(pipelineStatusesData);
    }
  }, [statusesSuccess, pipelineStatusesData]);

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
          {pipelineData?.name ? `${pipelineData.name} Pipeline` : "Pipeline"}
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