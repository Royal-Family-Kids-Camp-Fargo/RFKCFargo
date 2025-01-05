import React, { useState, useEffect, useCallback } from "react";
import { useParams,  useLoaderData } from "react-router";
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
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import pipelineApi from "~/api/objects/pipeline";
import pipelineStatusApi from "~/api/objects/pipelineStatus";
// import AddUserToPipeline from "./AddUserToPipeline";
import { botContextStore } from "~/stores/botContextStore";
import type { Route } from "../+types/dashboard";

// Types from your existing “@pipeline.ts”, “@pipelineStatus.ts”, “@user.ts” if needed
// import type { Pipeline } from "../../api/objects/pipeline";
// import type { PipelineStatus } from "../../api/objects/pipelineStatus";
// import type { User } from "../../api/objects/user";

// For convenience, define the ephemeral drag item type
const DRAG_TYPE = "USER_ITEM";

interface UserItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  fromStatus: string;
  // ...
}

// The card we'll drag
function UserCard({
  user,
  statusId,
  onDropUser,
}: {
  user: UserItem;
  statusId: string;
  onDropUser: (user: UserItem, toStatusId: string) => void;
}) {
  // Setup drag
  const [{ isDragging }, dragRef] = window.dndHooks?.useDragOriginal?.(
    {
      type: DRAG_TYPE,
      item: { ...user, fromStatus: statusId },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  ) || useDragReplacement({ user, statusId });

  return (
    <Paper
      ref={dragRef}
      elevation={1}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        mb: 1,
        p: 1,
        cursor: "move",
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
 * If you're not using the official React DnD hook, you can define a quick replacement below.
 * This is mostly for clarity in the snippet. Remove if you’re using the official `import { useDrag } from 'react-dnd'`.
 */
function useDragReplacement({
  user,
  statusId,
}: {
  user: UserItem;
  statusId: string;
}) {
  // fallback for demonstration
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = React.useRef<HTMLDivElement>(null);
  // minimal drag approach - you'd want the official useDrag from react-dnd
  return [
    { isDragging },
    dragRef,
  ];
}

// Column for each pipeline status
function StatusColumn({
  status,
  onDropUser,
  globalSearchTerm,
}: {
  status: any;
  onDropUser: (user: UserItem, toStatusId: string) => void;
  globalSearchTerm: string;
}) {
  const theme = useTheme();

  // Setup drop
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [{ isOver }, dropRef] = useDrop({
    accept: DRAG_TYPE,
    drop: (item: UserItem & { fromStatus: string }) => {
      if (item.fromStatus !== status.id) {
        onDropUser(item, status.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect the dropRef to the boxRef
  dropRef(boxRef);

  const filteredUsers = React.useMemo(() => {
    if (!status.user_collection || !Array.isArray(status.user_collection)) {
      return [];
    }
    if (!globalSearchTerm) return status.user_collection;

    return status.user_collection.filter((user: UserItem) => {
      const term = globalSearchTerm.toLowerCase();
      return (
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    });
  }, [status.user_collection, globalSearchTerm]);

  return (
    <Box
      ref={boxRef}
      sx={{
        minWidth: { xs: "85vw", sm: "350px" },
        maxWidth: { xs: "85vw", sm: "350px" },
        backgroundColor: isOver ? "#f1f3f5" : theme.palette.background.paper,
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
        <UserCard
          key={user.id}
          user={user}
          statusId={status.id}
          onDropUser={onDropUser}
        />
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
  // We’ll load from the queries, but also keep a local copy for quick UI updates.
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

  // Use effect to update boardData when query is successful
  useEffect(() => {
    if (statusesSuccess && pipelineStatuses) {
      setBoardData(pipelineStatuses);
    }
  }, [statusesSuccess, pipelineStatuses]);

  // This would call an endpoint that updates the user’s status in your DB.
  const updateUserStatusMutation = useMutation({
    mutationFn: async ({
      user,
      fromStatusId,
      toStatusId,
    }: {
      user: UserItem;
      fromStatusId: string;
      toStatusId: string;
    }) => {
      // Example: pipelineStatusApi.update or userApi.patch...
      // For demonstration, we assume pipelineStatusApi moves the user
      // Adjust as appropriate in your real project:
      await pipelineStatusApi.updateUserStatus({
        userId: user.id,
        fromStatusId,
        toStatusId,
      });
    },
    onSuccess: () => {
      // Invalidate or refetch if needed
      if (pipelineId) {
        queryClient.invalidateQueries({
          queryKey: ["pipelineStatuses", pipelineId],
        });
      }
    },
  });

  const onDropUser = useCallback(
    (userDragged: UserItem, toStatusId: string) => {
      // local UI update
      setBoardData((prevData) => {
        const newData = structuredClone(prevData); // or do a deep copy

        // Remove from old status
        const oldStatusIndex = newData.findIndex(
          (st: any) => st.id === userDragged.fromStatus
        );
        if (oldStatusIndex >= 0) {
          newData[oldStatusIndex].user_collection =
            newData[oldStatusIndex].user_collection.filter(
              (u: UserItem) => u.id !== userDragged.id
            );
        }

        // Add to new status
        const newStatusIndex = newData.findIndex(
          (st: any) => st.id === toStatusId
        );
        if (newStatusIndex >= 0) {
          newData[newStatusIndex].user_collection = [
            ...newData[newStatusIndex].user_collection,
            { ...userDragged },
          ];
        }

        return newData;
      });

      // call mutation to persist
      updateUserStatusMutation.mutate({
        user: userDragged,
        fromStatusId: userDragged.fromStatus,
        toStatusId,
      });
    },
    [updateUserStatusMutation]
  );

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

  // Compute an initial pipelineStatusId for the <AddUserToPipeline> form
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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </InputAdornment>
          ),
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
      <DndProvider backend={HTML5Backend}>
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
                onDropUser={onDropUser}
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
      </DndProvider>
    </Container>
  );
}