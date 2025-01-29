import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '~/api/objects/user';
import userPipelineStatusApi from '~/api/objects/userPipelineStatus';
import type { User, UserCreate } from '~/api/objects/user';
import type { PipelineStatus } from '~/api/objects/pipelineStatus';
import { authStore } from '~/stores/authStore';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  pipelineId: string;
  pipelineStatuses: PipelineStatus[];
}

export default function AddUserDialog({ open, onClose, pipelineId, pipelineStatuses }: AddUserDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [userToAdd, setUserToAdd] = useState<UserCreate>({} as UserCreate);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const currentUser = authStore.getUser();
  const queryClient = useQueryClient();

  // Mutation for creating a new user
  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: async (newUser: Partial<UserCreate>) => {
      console.log("Creating user", newUser);
      return await userApi.create(newUser);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addUserToPipeline(data.id);
      setUserToAdd({} as UserCreate);
    },
  });

  // Mutation for adding user to pipeline
  const { mutate: addUserToPipeline, isPending: isAdding } = useMutation({
    mutationFn: async (user_id: string) => {
      if (!user_id || !selectedStatus || !currentUser) return;
      
      return await userPipelineStatusApi.create({
        user_id: user_id,
        pipeline_id: pipelineId,
        pipeline_status_id: selectedStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelineStatuses'] });
      onClose();
      setSelectedStatus('');
      setSearchTerm('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({...userToAdd, location_id: currentUser?.location_id, assigned_to: currentUser?.id});
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add User to Pipeline</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>{userToAdd.first_name ? '' : 'First Name'}</InputLabel>
              <TextField
                value={userToAdd.first_name}
                onChange={(e) => setUserToAdd({ ...userToAdd, first_name: e.target.value })}
                fullWidth
                required
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{userToAdd.last_name ? '' : 'Last Name'}</InputLabel>
              <TextField
                value={userToAdd.last_name}
                onChange={(e) => setUserToAdd({ ...userToAdd, last_name: e.target.value })}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{userToAdd.email ? '' : 'Email'}</InputLabel>
              <TextField
                value={userToAdd.email}
                onChange={(e) => setUserToAdd({ ...userToAdd, email: e.target.value })}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{userToAdd.phone_number ? '' : 'Phone'}</InputLabel>
              <TextField
                value={userToAdd.phone_number}
                onChange={(e) => setUserToAdd({ ...userToAdd, phone_number: e.target.value })}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{userToAdd.city ? '' : 'City'}</InputLabel>
              <TextField
                value={userToAdd.city}
                onChange={(e) => setUserToAdd({ ...userToAdd, city: e.target.value })}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{selectedStatus ? '' : 'Pipeline Status'}</InputLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Pipeline Status"
              >
                {pipelineStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!userToAdd || !selectedStatus || isAdding || isCreatingUser}
          >
            {isAdding || isCreatingUser ? <CircularProgress size={24} /> : 'Add User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 