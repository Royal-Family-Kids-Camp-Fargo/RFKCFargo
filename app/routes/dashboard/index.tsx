import { authStore } from '~/stores/auth-store';
import type { Route } from './+types/index';
import { Outlet, redirect } from 'react-router';
import { Box, Divider } from '@mui/material';
import { TopNav } from '~/components/TopNav';
import DashNav from '~/components/DashNav';
// import { refresh } from '~/lib/auth';

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  let accessToken = authStore.getAccessToken();
  let user = authStore.getUser();
  if (!accessToken) {
    // await refresh();
    accessToken = authStore.getAccessToken();
    user = authStore.getUser();
    if (!accessToken) {
      return redirect('/sign-in');
    }
  }
  return { user };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if ('user' in loaderData) {
    const user = loaderData.user;

    return (
      <>
        <TopNav user={user} />
        <Divider />
        <Box sx={{ display: 'flex', border: '1px solid green' }} flexGrow={1}>
          <DashNav />
          <Divider orientation="vertical" flexItem />
          <Box component="main" flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
      </>
    );
  }
  return <div>Loading...</div>;
}
