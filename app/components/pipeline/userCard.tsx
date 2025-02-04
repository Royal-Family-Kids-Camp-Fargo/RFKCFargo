import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { ChevronLeft, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import type { User } from '~/api/objects/user';
import userPipelineStatusApi from '~/api/objects/userPipelineStatus';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SmsDialog from './SmsDialog';

export type StatusIds = {
  previousStatusId: string | null;
  currentStatusId: string;
  nextStatusId: string | null;
};
/**
 * UserCard component.
 */
export default function UserCard({
  user,
  statusIds,
  pipelineId,
}: {
  user: User;
  statusIds: StatusIds;
  pipelineId: string;
}) {
  const queryClient = useQueryClient();
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);

  const { mutate: movePipelineStatusBackward } = useMutation({
    mutationFn: (statusIds: StatusIds) => {
      if (!statusIds.previousStatusId)
        return Promise.reject('No previous status');
      return userPipelineStatusApi.movePipelineStatus(
        user.id,
        pipelineId,
        statusIds.previousStatusId
      );
    },
    onSuccess: (data: any) => {
      console.log('onSuccess backward');
      queryClient.setQueryData(['pipelineStatuses'], (oldData: any) => {
        try {
          const newData = {
            ...oldData,
            [data.user_id]: data,
          };
          return newData;
        } catch (error) {
          console.error('Error updating pipeline statuses', error);
          return oldData;
        }
      });
    },
  });

  const { mutate: movePipelineStatusForward } = useMutation({
    mutationFn: (statusIds: StatusIds) => {
      if (!statusIds.nextStatusId) return Promise.reject('No next status');
      return userPipelineStatusApi.movePipelineStatus(
        user.id,
        pipelineId,
        statusIds.nextStatusId
      );
    },
    onSuccess: (data: any) => {
      console.log('onSuccess forward', data);
      queryClient.setQueryData(['pipelineStatuses'], (oldData: any) => {
        try {
          const newData = {
            ...oldData,
            [data.user_id]: data,
          };
          return newData;
        } catch (error) {
          console.error('Error updating pipeline statuses', error);
          return oldData;
        }
      });
    },
  });

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full bg-card rounded-lg border"
      >
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-semibold">
              {user.first_name || user.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'No Name'}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm">{user.phone_number || 'No Phone'}</p>
              <p className="text-sm">
                Assigned to: {user.user?.first_name || 'No Assignment'}
              </p>
              <div className="flex items-center justify-between mt-4">
                {statusIds.previousStatusId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => movePipelineStatusBackward(statusIds)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSmsDialogOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={`tel:${user.phone_number}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
                {statusIds.nextStatusId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => movePipelineStatusForward(statusIds)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <SmsDialog
        open={isSmsDialogOpen}
        onClose={() => setIsSmsDialogOpen(false)}
        user={user}
      />
    </>
  );
}
