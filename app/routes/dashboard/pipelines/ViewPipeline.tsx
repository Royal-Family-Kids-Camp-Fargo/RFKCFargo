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
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import pipelineApi from "~/api/objects/pipeline";
import type { Pipeline } from "~/api/objects/pipeline";
import pipelineStatusApi from "~/api/objects/pipelineStatus";
import type { PipelineStatus } from "~/api/objects/pipelineStatus";
import { botContextStore } from "~/stores/botContextStore";
import { authStore } from "~/stores/authStore";
import type { Route } from "../+types/dashboard";
import StatusColumn from "~/components/pipeline/statusColumn";
import type { StatusIds } from "~/components/pipeline/userCard";
import type { UserPipelineStatus } from "~/api/objects/userPipelineStatus";
import userPipelineStatusApi from "~/api/objects/userPipelineStatus";
import type { User, UserBase } from "~/api/objects/user";

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

  if (pipelineRes instanceof Error) {
    throw pipelineRes;
  }

  // Cast to unknown first to avoid type errors
  return {
    pipeline: pipelineRes as unknown as Pipeline,
    userPipelineStatuses: userPipelineStatusesRes,
  };
};

// Custom hook for filtering users
function useUserFiltering(boardData: BoardData, currentUser: User | null) {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [filterByAssignedTo, setFilterByAssignedTo] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const assignedUsers = React.useMemo(() => {
    const users = new Map<string, UserBase>();
    Object.values(boardData).forEach((status) => {
      if (status.user.user) {
        const { id, first_name, last_name, email } = status.user.user;
        users.set(id, { id, first_name, last_name, email });
      }
    });
    return Array.from(users.values());
  }, [boardData]);

  const filterUsers = (users: UserPipelineStatus[], statusId: string) => {
    return users.filter((user: UserPipelineStatus) => {
      const matchesStatus = user.pipeline_status_id == statusId;
      const matchesSearch = !globalSearchTerm || 
        user.user.first_name?.toLowerCase().includes(globalSearchTerm) ||
        user.user.last_name?.toLowerCase().includes(globalSearchTerm) ||
        user.user.email?.toLowerCase().includes(globalSearchTerm);
      const matchesFilter = !filterByAssignedTo || 
        (selectedUserId ? user.user.user?.id === selectedUserId : user.user.user?.id === currentUser?.id);
      return matchesStatus && matchesSearch && matchesFilter;
    });
  };

  return {
    globalSearchTerm,
    setGlobalSearchTerm,
    filterByAssignedTo,
    setFilterByAssignedTo,
    selectedUserId,
    setSelectedUserId,
    anchorEl,
    setAnchorEl,
    assignedUsers,
    filterUsers
  };
}

// Custom hook for pipeline status management
function usePipelineStatus(pipelineData: Pipeline | null) {
  const getAdjacentStatusIds = (currentStatusId: string): StatusIds => {
    if (!pipelineData) return {
      previousStatusId: null,
      currentStatusId,
      nextStatusId: null,
    };

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

  return { getAdjacentStatusIds };
}

export default function ViewPipeline({ loaderData }: { loaderData: any }) {
  const { pipeline, userPipelineStatuses } = loaderData as {
    pipeline: Pipeline;
    userPipelineStatuses: BoardData;
  };

  const theme = useTheme();
  const { pipelineId } = useParams();
  const currentUser = authStore.getUser() || null;
  const [boardData, setBoardData] = useState<BoardData>(userPipelineStatuses);

  // Now you can use `useQuery` with `initialData` from the cache
  const {
    data: pipelineData,
    isLoading: pipelineLoading,
    error: pipelineError,
  } = useQuery({
    queryKey: ["pipeline", pipelineId],
    queryFn: async () => {
      const res = await pipelineApi.get(pipelineId as string, null);
      if (res instanceof Error) {
        throw res;
      }
      // Cast to unknown first to avoid type errors
      return res as unknown as Pipeline;
    },
    initialData: pipeline,
  });

  // Use custom hooks
  const {
    globalSearchTerm,
    setGlobalSearchTerm,
    filterByAssignedTo,
    setFilterByAssignedTo,
    selectedUserId,
    setSelectedUserId,
    anchorEl,
    setAnchorEl,
    assignedUsers,
    filterUsers
  } = useUserFiltering(boardData, currentUser);

  const { getAdjacentStatusIds } = usePipelineStatus(pipelineData);

  // For adding more context to your AI store
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;

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

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (userId: string | null) => {
    setSelectedUserId(userId);
    setFilterByAssignedTo(true);
    handleFilterClose();
  };

  const open = Boolean(anchorEl);

  if (pipelineLoading || statusesLoading) {
    return (
      <Container>
        <Typography>Loading pipeline data...</Typography>
      </Container>
    );
  }

  if (pipelineError || statusesError || !pipelineData) {
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
          {pipelineData.name ? `${pipelineData.name} Pipeline` : "Pipeline"}
        </Typography>
      </Box>

      {/* Search input with filter icon */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users by name or email..."
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                />
              </InputAdornment>
            ),
          }}
        />
        <Tooltip title="Filter by assigned user">
          <IconButton 
            onClick={handleFilterClick}
            color={filterByAssignedTo ? "primary" : "default"}
            sx={{ border: filterByAssignedTo ? 1 : 0 }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <List sx={{ width: 250 }}>
            <ListItem>
              <ListItemText 
                primary="Filter by assigned user" 
                primaryTypographyProps={{
                  variant: "subtitle2",
                  color: "text.secondary"
                }}
              />
            </ListItem>
            <Divider />
            <ListItemButton 
              selected={!filterByAssignedTo}
              onClick={() => {
                setFilterByAssignedTo(false);
                handleFilterClose();
              }}
            >
              <ListItemText primary="Show all users" />
            </ListItemButton>
            <ListItemButton 
              selected={filterByAssignedTo && selectedUserId === currentUser?.id}
              onClick={() => handleFilterSelect(currentUser?.id || null)}
            >
              <ListItemText primary="My assigned users" />
            </ListItemButton>
            <Divider />
            {assignedUsers.map((user) => (
              <ListItemButton
                key={user.id}
                selected={filterByAssignedTo && selectedUserId === user.id}
                onClick={() => handleFilterSelect(user.id)}
              >
                <ListItemText 
                  primary={`${user.first_name} ${user.last_name}`}
                  secondary={user.email}
                />
              </ListItemButton>
            ))}
          </List>
        </Popover>
      </Box>

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
        {pipelineData.pipeline_status_collection.length > 0 ? (
          [...pipelineData.pipeline_status_collection]
            .sort((a: PipelineStatus, b: PipelineStatus) => a.order - b.order)
            .map((status: PipelineStatus) => (
              <StatusColumn
                key={status.id}
                status={status}
                userPipelineStatuses={filterUsers(Object.values(boardData), status.id)}
                statusIds={getAdjacentStatusIds(status.id)}
                pipelineId={pipelineData.id}
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
