import { Box } from '@mui/material';
import { getApplications } from '~/api/applications';
import ApplicationCard from '~/components/ApplicationCard';
import type { Route } from './+types/index';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const applications = await getApplications();
  return { applications };
}

export default function Applications({ loaderData }: Route.ComponentProps) {
  const applications = loaderData.applications;
  return (
    <Box
      sx={{
        padding: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 2,
      }}
    >
      {applications.map((application) => (
        <ApplicationCard name={application.name} id={application.id} />
      ))}
    </Box>
  );
}
