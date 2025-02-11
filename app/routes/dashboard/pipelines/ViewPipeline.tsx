import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useFetchers, useLocation } from 'react-router';
import { Search, Filter, Plus } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '~/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Separator } from '~/components/ui/separator';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '~/components/ui/command';

import pipelineApi from '~/api/objects/pipeline';
import type { Pipeline } from '~/api/objects/pipeline';
import type { PipelineStatus } from '~/api/objects/pipelineStatus';
import { botContextStore } from '~/stores/botContextStore';
import { authStore } from '~/stores/authStore.client';
import type { Route } from './+types/ViewPipeline';
import StatusColumn from '~/components/pipeline/statusColumn';
import type { StatusIds } from '~/components/pipeline/userCard';
import type { UserPipelineStatus } from '~/api/objects/userPipelineStatus';
import userPipelineStatusApi from '~/api/objects/userPipelineStatus';
import type { User, UserBase } from '~/api/objects/user';
import AddUserDialog from '~/components/pipeline/AddUserDialog';

// type UserPipelineStatus = {
//   id: string;
//   name: string;
//   email: string;
//   pipeline_status_id: string;
//   assigned_to: string;
// };

export type BoardData = Record<string, UserPipelineStatus>;

const getUserPipelineStatuses = async (
  pipelineId: string
): Promise<BoardData> => {
  const res = await userPipelineStatusApi.getAll(
    {
      filter: `pipeline_id = ${pipelineId}`,
      limit: 1000,
      offset: 0,
      ordering: 'order asc',
    },
    'user_id'
  );

  if ('error' in res) {
    throw res.error;
  }

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
  console.log('clientLoader');
  const { pipelineId } = params;
  if (!pipelineId) {
    throw new Error('Pipeline ID is required');
  }

  const [pipelineRes, userPipelineStatusesRes] = await Promise.all([
    pipelineApi.get(pipelineId as string, null),
    getUserPipelineStatuses(pipelineId as string),
  ]);

  if ('error' in pipelineRes) {
    throw pipelineRes.error;
  }

  if (!pipelineRes.data) {
    throw new Error('Pipeline not found');
  }

  return {
    pipeline: pipelineRes.data,
    userPipelineStatuses: userPipelineStatusesRes,
  };
};

// Custom hook for filtering users
function useUserFiltering(boardData: BoardData, currentUser: User | null) {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [filterByAssignedTo, setFilterByAssignedTo] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUnassigned, setSelectedUnassigned] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const assignedUsers = React.useMemo(() => {
    const users = new Map<string, UserBase>();
    Object.values(boardData).forEach((status) => {
      if (status?.user?.user) {
        const { id, first_name, last_name, email } = status.user.user;
        users.set(id, { id, first_name, last_name, email });
      }
    });
    return Array.from(users.values());
  }, [boardData]);

  useEffect(() => {
    console.log('Global Search Term:', globalSearchTerm);
    console.log('Filter By Assigned To:', filterByAssignedTo);
    console.log('Selected User ID:', selectedUserId);
    console.log('Selected Unassigned:', selectedUnassigned);
    console.log('Anchor Element:', anchorEl);
    console.log('Assigned Users:', assignedUsers);
  }, [
    globalSearchTerm,
    filterByAssignedTo,
    selectedUserId,
    selectedUnassigned,
    anchorEl,
    assignedUsers,
  ]);
  const filterUsers = (users: UserPipelineStatus[], statusId: string) => {
    return users.filter((user: UserPipelineStatus) => {
      const matchesStatus = user.pipeline_status_id == statusId;
      const matchesSearch =
        !globalSearchTerm ||
        user.user?.first_name?.toLowerCase().includes(globalSearchTerm) ||
        user.user?.last_name?.toLowerCase().includes(globalSearchTerm) ||
        user.user?.email?.toLowerCase().includes(globalSearchTerm);
      const matchesFilter =
        filterByAssignedTo &&
        (selectedUserId
          ? user.user?.user?.id === selectedUserId
          : user.user?.user?.id === currentUser?.id);
      const matchesUnassigned = selectedUnassigned && !user.user?.user?.id;
      const showAllUsers = !filterByAssignedTo && !selectedUnassigned;
      return (
        matchesStatus &&
        matchesSearch &&
        (matchesFilter || matchesUnassigned || showAllUsers)
      );
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
    filterUsers,
    selectedUnassigned,
    setSelectedUnassigned,
  };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'updatePipelineStatus') {
    const userId = formData.get('userId') as string;
    const pipelineId = formData.get('pipelineId') as string;
    const newStatusId = formData.get('newStatusId') as string;

    if (!userId || !pipelineId || !newStatusId) {
      return { error: 'Missing required fields' };
    }

    try {
      const result = await userPipelineStatusApi.movePipelineStatus(
        userId,
        pipelineId,
        newStatusId
      );
      return result;
    } catch (error) {
      console.error('Error updating pipeline status:', error);
      return { error: 'Failed to update pipeline status' };
    }
  }

  return { error: 'Invalid action' };
}

// Custom hook for pipeline status management
function usePipelineStatus(pipelineData: Pipeline | null) {
  const getAdjacentStatusIds = (currentStatusId: string): StatusIds => {
    if (!pipelineData)
      return {
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

export default function ViewPipeline({ loaderData }: Route.ComponentProps) {
  const { pipeline, userPipelineStatuses } = loaderData;
  const [boardData, setBoardData] = useState<BoardData>(userPipelineStatuses);
  const location = useLocation();
  const allFetchers = useFetchers();
  const fetchers = useMemo(
    () =>
      allFetchers.filter(
        (f) =>
          f.formAction === location.pathname && f.formData?.get('newStatusId')
      ),
    [allFetchers, location.pathname]
  );
  const updates = fetchers.reduce((acc, fetcher) => {
    if (!fetcher.formData) return acc;

    const newStatusId = fetcher.formData.get('newStatusId') as string;
    const userId = fetcher.formData.get('userId') as string;

    return {
      ...acc,
      [userId]: {
        ...boardData[userId],
        pipeline_status_id: newStatusId,
      },
    };
  }, {});

  console.log('updates', updates);

  const optimisticBoardData = { ...boardData, ...updates };
  const { pipelineId } = useParams();
  const currentUser = authStore.getUser() || null;
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  useEffect(() => {
    setBoardData(userPipelineStatuses);
  }, [userPipelineStatuses]);

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
    filterUsers,
    selectedUnassigned,
    setSelectedUnassigned,
  } = useUserFiltering(optimisticBoardData, currentUser);

  const { getAdjacentStatusIds } = usePipelineStatus(pipeline);

  // For adding more context to your AI store
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;

  useEffect(() => {
    if (pipelineId && pipeline) {
      console.log('Adding context to NLAPI');
      const pipeline_status_collection_string =
        pipeline.pipeline_status_collection
          .map((ps: PipelineStatus) => `${ps.name} with id of ${ps.id}`)
          .join('\n');
      const context = [
        `User is looking at pipeline with id: ${pipeline.id} and name: ${pipeline.name}.`,
        `Pipeline ${pipeline.name} has the following stages: \n ${pipeline_status_collection_string}`,
        `If the user asks to move a user to a stage, you'll need to search for the user id. use the ilike operator and users resolvers to search with case insensitive search.`,
        `To move a user to a stage, you'll need to use the update_user_pipeline_status mutation. like this:mutation { update_user_pipeline_status(user_id: number, pipeline_id: number, input: $input) { id } }`,
      ];
      context.forEach((c: string) => addBotContext(c));

      return () => {
        console.log('Removing context from NLAPI');
        context.forEach((c: string) => removeBotContext(c));
      };
    }
  }, [pipelineId, pipeline]);

  const handleSearchChange = (value: string) => {
    setGlobalSearchTerm(value.toLowerCase());
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (userId: string | null) => {
    setSelectedUserId(userId);
    setFilterByAssignedTo(true);
    setSelectedUnassigned(false);
    handleFilterClose();
  };

  const handleUnassignedSelect = () => {
    setSelectedUserId(null);
    setFilterByAssignedTo(false);
    setSelectedUnassigned(true);
    handleFilterClose();
  };

  // if (pipelineError || statusesError || !pipelineData) {
  //   return (
  //     <div className="container mx-auto px-4">
  //       <p className="text-destructive">Error loading pipeline or statuses.</p>
  //     </div>
  //   );
  // }

  return (
    <div className="h-full flex flex-col gap-2">
      <TooltipProvider>
        {/* Search input with filter icon */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant={filterByAssignedTo ? 'default' : 'outline'}
                    size="icon"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>Filter by assigned user</TooltipContent>
            </Tooltip>
            <PopoverContent className="w-[250px] p-0" align="end">
              <Command>
                <CommandList>
                  <CommandGroup heading="Filter by assigned user">
                    <CommandItem
                      onSelect={() => {
                        setFilterByAssignedTo(false);
                        setSelectedUnassigned(false);
                        handleFilterClose();
                      }}
                    >
                      Show all users
                    </CommandItem>
                    <CommandItem
                      onSelect={() =>
                        handleFilterSelect(currentUser?.id || null)
                      }
                    >
                      My assigned users
                    </CommandItem>
                    <CommandItem onSelect={handleUnassignedSelect}>
                      Unassigned users
                    </CommandItem>
                  </CommandGroup>
                  <Separator />
                  <CommandGroup heading="Assigned Users">
                    {assignedUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => handleFilterSelect(user.id)}
                      >
                        <div>
                          <p>{`${user.first_name} ${user.last_name}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* The Kanban board */}
        <div className="flex flex-col flex-1 min-h-0 bg-muted rounded-lg p-4">
          <div className="flex flex-1 overflow-x-auto gap-4 mt-4 bg-none touch-pan-x">
            {pipeline.pipeline_status_collection.length > 0 ? (
              [...pipeline.pipeline_status_collection]
                .sort(
                  (a: PipelineStatus, b: PipelineStatus) => a.order - b.order
                )
                .map((status: PipelineStatus) => (
                  <StatusColumn
                    key={status.id}
                    status={status}
                    userPipelineStatuses={filterUsers(
                      Object.values(optimisticBoardData),
                      status.id
                    )}
                    statusIds={getAdjacentStatusIds(status.id)}
                    pipelineId={pipeline.id}
                  />
                ))
            ) : (
              <div className="text-center mt-8 w-full">
                <p className="text-sm sm:text-base">
                  No statuses found. Please add statuses to this pipeline.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add User Dialog */}
        <AddUserDialog
          open={isAddUserDialogOpen}
          onClose={() => setIsAddUserDialogOpen(false)}
          pipelineId={pipelineId as string}
          pipelineStatuses={pipeline.pipeline_status_collection}
        />
      </TooltipProvider>
    </div>
  );
}
