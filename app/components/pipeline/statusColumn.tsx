import React from 'react';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import UserCard from './userCard';
import type { StatusIds } from './userCard';

import type { PipelineStatus } from '~/api/objects/pipelineStatus';
import type { UserPipelineStatus } from '~/api/objects/userPipelineStatus';
import { Separator } from '../ui/separator';
/**
 * Each status column.
 */
export default function StatusColumn({
  status,
  statusIds,
  pipelineId,
  userPipelineStatuses,
}: {
  status: PipelineStatus;
  userPipelineStatuses: UserPipelineStatus[];
  statusIds: StatusIds;
  pipelineId: string;
}) {
  return (
    <Card className="min-w-[85vw] sm:min-w-[350px] sm:max-w-[350px] bg-background h-fit">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center text-primary pb-1">
          <span className="text-lg sm:text-xl font-bold uppercase tracking-wide">
            {status.name}
          </span>
          <span className="text-muted-foreground text-sm">
            {userPipelineStatuses.length || 0}
          </span>
        </div>
        <Separator />
      </CardHeader>
      <CardContent className="space-y-2">
        {userPipelineStatuses.map(
          (user_pipeline_status: UserPipelineStatus) => (
            <UserCard
              key={user_pipeline_status.user.id}
              user={user_pipeline_status.user}
              statusIds={statusIds}
              pipelineId={pipelineId}
            />
          )
        )}
      </CardContent>
    </Card>
  );
}
