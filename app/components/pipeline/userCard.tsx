import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { ChevronLeft, ChevronRight, MessageSquare, Phone } from 'lucide-react';
import type { User } from '~/api/objects/user';
import { useFetcher } from 'react-router';
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
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const fetcher = useFetcher();

  const movePipelineStatusBackward = () => {
    if (!statusIds.previousStatusId) return;
    fetcher.submit(
      {
        intent: 'updatePipelineStatus',
        userId: user.id,
        pipelineId,
        newStatusId: statusIds.previousStatusId,
      },
      { method: 'post', action: `/dashboard/pipelines/${pipelineId}` }
    );
  };

  const movePipelineStatusForward = () => {
    if (!statusIds.nextStatusId) return;
    fetcher.submit(
      {
        intent: 'updatePipelineStatus',
        userId: user.id,
        pipelineId,
        newStatusId: statusIds.nextStatusId,
      },
      { method: 'post', action: `/dashboard/pipelines/${pipelineId}` }
    );
  };

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
            <div className="flex flex-wrap gap-2 mt-2">
              {user.tags_collection.map((tag) => (
                <span
                  key={tag.id}
                  className="bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
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
                    onClick={movePipelineStatusBackward}
                    disabled={fetcher.state !== 'idle'}
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
                    onClick={movePipelineStatusForward}
                    disabled={fetcher.state !== 'idle'}
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
