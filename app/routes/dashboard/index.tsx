import { authStore } from '~/stores/auth-store';
import type { Route } from './+types/index';
import { Outlet, redirect } from 'react-router';
import { Box, Divider } from '@mui/material';
import { TopNav } from '~/components/TopNav';
import DashNav from '~/components/DashNav';
import pipelineApi, { type Pipeline } from '~/api/objects/pipeline';
import formApi, { type Form } from '~/api/objects/form';
// import { refresh } from '~/lib/auth';

type LoaderData = {
  user: any;
  pipelines: Pipeline[];
  forms: Form[];
};

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

  // Add the pipelines and forms fetch
  const [pipelines, forms] = await Promise.all([
    pipelineApi.getAll({ limit: 100, offset: 0, ordering: "", filter: "" }),
    formApi.getAll({ limit: 100, offset: 0, ordering: "", filter: "" })
  ]);

  return { user, pipelines: pipelines.data, forms: forms.data };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if ('user' in loaderData) {
    const { user, pipelines, forms } = loaderData as LoaderData;

    return (
      <>
        <TopNav user={user} />
        <Divider />
        <Box sx={{ display: 'flex', border: '1px solid green' }} flexGrow={1}>
          <DashNav pipelines={pipelines} forms={forms} />
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
