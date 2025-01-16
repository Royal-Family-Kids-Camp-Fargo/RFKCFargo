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
import StatusColumn from "~/components/pipeline/statusColumn";
import type { StatusIds } from "~/components/pipeline/userCard";
import type { UserPipelineStatus } from "~/api/objects/userPipelineStatus";
import userPipelineStatusApi from "~/api/objects/userPipelineStatus";

// type UserPipelineStatus = {
//   id: string;
//   name: string;
//   email: string;
//   pipeline_status_id: string;
//   assigned_to: string;
// };

type BoardData = Record<string, UserPipelineStatus>;

const getUserPipelineStatuses = async (
  pipelineId: string
): Promise<BoardData> => {
  const res = await userPipelineStatusApi.getAll(
    {
      filter: `pipeline_id = ${pipelineId}`,
      limit: 1000,
      offset: 0,
      ordering: "order asc",
    },
    "user_id"
  );

  // Transform the response data to match the BoardData structure
  const users_hash = res.data.reduce(
    (acc: Record<string, UserPipelineStatus>, user: UserPipelineStatus) => {
      acc[user.user.id] = user;
      return acc;
    },
    {}
  );

  return { ...users_hash };
};

// Define the loader function
export const clientLoader = async ({
  params,
}: Route.ClientLoaderArgs): Promise<{
  pipeline: Pipeline;
  userPipelineStatuses: BoardData;
}> => {
  const { pipelineId } = params;
  if (!pipelineId) {
    throw new Error("Pipeline ID is required");
  }

  const [pipelineRes, userPipelineStatusesRes] = await Promise.all([
    pipelineApi.get(pipelineId as string, null),
    getUserPipelineStatuses(pipelineId as string),
  ]);

  console.log("clientLoader userPipelineStatusesRes", userPipelineStatusesRes);

  return {
    pipeline: pipelineRes,
    userPipelineStatuses: userPipelineStatusesRes,
  };
};

export default function ViewPipeline({ loaderData }: { loaderData: any }) {
  const { pipeline, userPipelineStatuses } = loaderData as {
    pipeline: Pipeline;
    userPipelineStatuses: BoardData;
  };

  const theme = useTheme();

  const { pipelineId } = useParams();
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // For adding more context to your AI store
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;

  // Track ephemeral board state (e.g., statuses with user arrays).
  const [boardData, setBoardData] = useState<BoardData>(userPipelineStatuses);

  // Now you can use `useQuery` with `initialData` from the cache
  const {
    data: pipelineData,
    isLoading: pipelineLoading,
    error: pipelineError,
  } = useQuery({
    queryKey: ["pipeline", pipelineId],
    queryFn: () => pipelineApi.get(pipelineId as string, null),
    initialData: pipeline,
  });

  const {
    data: userPipelineStatusesData,
    isLoading: statusesLoading,
    error: statusesError,
    isSuccess: statusesSuccess,
  } = useQuery({
    queryKey: ["pipelineStatuses"],
    queryFn: () => getUserPipelineStatuses(pipelineId as string),
    initialData: userPipelineStatuses,
  });

  // Function to fetch and cache a single status
  // const useStatus = (statusId: string) => {
  //   return useQuery({
  //     queryKey: ["status", statusId],
  //     queryFn: () => getStatusById(statusId),
  //     enabled: !!statusId,
  //   });
  // };

  // Update boardData when query is successful
  useEffect(() => {
    if (statusesSuccess && userPipelineStatusesData) {
      setBoardData(userPipelineStatusesData);
    }
  }, [statusesSuccess, userPipelineStatusesData]);

  useEffect(() => {
    if (pipelineId && pipelineData) {
      console.log("Adding context to NLAPI");
      const pipeline_status_collection_string = pipelineData.pipeline_status_collection.map((ps: PipelineStatus) => `${ps.name} with id of ${ps.id}`).join("\n");
      const context = [
        `User is looking at pipeline with id: ${pipelineData.id} and name: ${pipelineData.name}.`,
        ` Pipeline ${pipelineData.name} has the following stages: \n ${pipeline_status_collection_string}`,
        `If the user asks to move a user to a stage, you'll need to search for the user id. use the ilike operator and users resolvers to search with case insensitive search.`,
        `To move a user to a stage, you'll need to use the update_user_pipeline_status mutation. like this:mutation { update_user_pipeline_status(user_id: number, pipeline_id: number, input: $input) { id } }`,
      ];
      context.forEach((c: string) => addBotContext(c));

      return () => {
        console.log("Removing context from NLAPI");
        context.forEach((c: string) => removeBotContext(c));
      };
    }
  }, [pipelineId, pipelineData]);

  const handleSearchChange = (value: string) => {
    setGlobalSearchTerm(value.toLowerCase());
  };

  const getAdjacentStatusIds = (currentStatusId: string): StatusIds => {
    const pipelineStatuses = [...pipelineData.pipeline_status_collection].sort(
      (a: PipelineStatus, b: PipelineStatus) => a.order - b.order
    );
    const currentIndex = pipelineStatuses.findIndex(
      (status: PipelineStatus) => status.id === currentStatusId
    );

    return {
      previousStatusId:
        currentIndex > 0 ? pipelineStatuses[currentIndex - 1].id : null,
      currentStatusId: currentStatusId,
      nextStatusId:
        currentIndex < pipelineStatuses.length - 1
          ? pipelineStatuses[currentIndex + 1].id
          : null,
    };
  };

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
        <Typography color="error">
          Error loading pipeline or statuses.
        </Typography>
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
                <SearchIcon
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                />
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
        {pipelineData && pipelineData.pipeline_status_collection.length > 0 ? (
          [...pipelineData.pipeline_status_collection]
            .sort((a: PipelineStatus, b: PipelineStatus) => a.order - b.order)
            .map((status: PipelineStatus) => (
              <StatusColumn
                key={status.id}
                status={status}
                userPipelineStatuses={Object.values(boardData).filter(
                  (user: UserPipelineStatus) =>
                    user.pipeline_status_id == status.id
                )}
                globalSearchTerm={globalSearchTerm}
                statusIds={getAdjacentStatusIds(status.id)}
                pipelineId={pipelineData.id as string}
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
