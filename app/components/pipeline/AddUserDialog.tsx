import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userApi from '~/api/objects/user';
import userPipelineStatusApi from '~/api/objects/userPipelineStatus';
import type { User, UserCreate } from '~/api/objects/user';
import type { PipelineStatus } from '~/api/objects/pipelineStatus';
import { authStore } from '~/stores/authStore.client';

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  pipelineId: string;
  pipelineStatuses: PipelineStatus[];
}

export default function AddUserDialog({
  open,
  onClose,
  pipelineId,
  pipelineStatuses,
}: AddUserDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const currentUser = authStore.getUser();
  const queryClient = useQueryClient();
  const form = useForm<UserCreate>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      city: '',
    },
  });

  // Mutation for creating a new user
  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: async (newUser: Partial<UserCreate>) => {
      console.log('Creating user', newUser);
      return await userApi.create(newUser);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addUserToPipeline(data.id);
      form.reset();
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

  const onSubmit = (data: UserCreate) => {
    createUser({
      ...data,
      location_id: currentUser?.location_id,
      assigned_to: currentUser?.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User to Pipeline</DialogTitle>
          <DialogDescription>
            Fill in the user details below to add them to the pipeline.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Pipeline Status</FormLabel>
              <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {pipelineStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedStatus || isAdding || isCreatingUser}
              >
                {isAdding || isCreatingUser ? 'Adding...' : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
