import { authStore } from '~/stores/auth-store';
import type { Route } from './+types/index';
import { Outlet, redirect } from 'react-router';
import { Box, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { TopNav } from '~/components/TopNav';
import DashNav from '~/components/DashNav';
import pipelineApi, { type Pipeline } from '~/api/objects/pipeline';
import formApi, { type Form } from '~/api/objects/form';
// import { refresh } from '~/lib/auth';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, createContext, useContext } from 'react';

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

export const DashboardContext = createContext<{
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
}>({
  isNavOpen: true,
  setIsNavOpen: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isNavOpen, setIsNavOpen] = useState(!isMobile);

  if ('user' in loaderData) {
    const { user, pipelines, forms } = loaderData as LoaderData;

    return (
      <DashboardContext.Provider value={{ isNavOpen, setIsNavOpen }}>
        <TopNav user={user}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setIsNavOpen(!isNavOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
              <p>Menu</p>
            </IconButton>
          )}
        </TopNav>
        <Divider />
        <Box sx={{ display: 'flex', border: '1px solid green' }} flexGrow={1}>
          <Box
            sx={{
              display: isNavOpen ? 'block' : 'none',
              position: { xs: 'absolute', md: 'static' },
              height: { xs: 'calc(100vh - 64px)', md: 'auto' },
              backgroundColor: 'background.paper',
              zIndex: { xs: 1200, md: 'auto' },
              boxShadow: { xs: 4, md: 0 },
            }}
          >
            <DashNav pipelines={pipelines} forms={forms} />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box component="main" flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
      </DashboardContext.Provider>
    );
  }
  return <div>Loading...</div>;
}
