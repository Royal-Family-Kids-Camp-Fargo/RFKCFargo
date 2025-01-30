import {
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  Drawer,
  Divider,
} from '@mui/material';
import type { BoxProps } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useLocation, useNavigate, matchPath } from 'react-router';
import { useState } from 'react';
import pipelineApi, { type Pipeline } from '~/api/objects/pipeline';
import formApi, { type Form } from '~/api/objects/form';
import { authStore } from '~/stores/authStore';
import CampaignIcon from '@mui/icons-material/Campaign';
import MessageIcon from '@mui/icons-material/Message';
import HomeIcon from '@mui/icons-material/Home';
// Loader function to fetch both pipelines and forms
export async function loader() {
  const [pipelines, forms] = await Promise.all([
    pipelineApi.getAll({ limit: 100, offset: 0, ordering: '', filter: '' }),
    formApi.getAll({ limit: 100, offset: 0, ordering: '', filter: '' }),
  ]);

  return { pipelines: pipelines.data, forms: forms.data };
}

type LoaderData = {
  pipelines: Pipeline[];
  forms: Form[];
};

type DashNavProps = BoxProps & {
  pipelines: Pipeline[];
  forms: Form[];
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export default function DashNav({
  pipelines,
  forms,
  mobileOpen,
  setMobileOpen,
  ...props
}: DashNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openPipelines, setOpenPipelines] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClick = async () => {
    await authStore.logout();
    navigate('/sign-in');
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawerContent = (
    <>
      <List>
        <ListItem>
          <ListItemButton
            onClick={() => navigate('/dashboard')}
            selected={matchPath(location.pathname, '/dashboard') !== null}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => setOpenPipelines(!openPipelines)}>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="Pipelines" />
            {openPipelines ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        {openPipelines && (
          <List component="div" disablePadding>
            {pipelines.map((pipeline) => (
              <ListItemButton
                key={pipeline.id}
                sx={{ pl: 4 }}
                component={Link}
                to={`/dashboard/pipelines/${pipeline.id}`}
                selected={
                  location.pathname === `/dashboard/pipelines/${pipeline.id}`
                }
              >
                <ListItemText primary={pipeline.name} />
              </ListItemButton>
            ))}
          </List>
        )}
        <ListItem>
          <ListItemButton
            component={Link}
            to="/dashboard/announcements"
            selected={location.pathname === '/dashboard/announcements'}
          >
            <ListItemIcon>
              <CampaignIcon />
            </ListItemIcon>
            <ListItemText primary="Announcements" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton
            component={Link}
            to="/dashboard/sms-templates"
            selected={location.pathname === '/dashboard/sms-templates'}
          >
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="SMS Templates" />
          </ListItemButton>
        </ListItem>

        {/* <ListItem>
    <ListItemButton onClick={() => setOpenForms(!openForms)}>
      <ListItemIcon>
        <DescriptionIcon />
      </ListItemIcon>
      <ListItemText primary="Forms" />
      {openForms ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  </ListItem>
  {openForms && (
    <List component="div" disablePadding>
      {forms.map((form) => (
        <ListItemButton
          key={form.id}
          sx={{ pl: 4 }}
          component={Link}
          to={`/dashboard/forms/${form.id}`}
          selected={location.pathname === `/dashboard/forms/${form.id}`}
        >
          <ListItemText primary={form.name} />
        </ListItemButton>
      ))}
    </List>
  )}*/}
      </List>
      <Button variant="outlined" onClick={handleClick} sx={{ margin: 2 }}>
        Logout
      </Button>
    </>
  );

  return (
    <>
      <Drawer
        open={mobileOpen}
        sx={{
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 2,
        }}
        ModalProps={{
          keepMounted: true,
        }}
        onClose={handleDrawerClose}
        onTransitionEnd={handleDrawerTransitionEnd}
      >
        {drawerContent}
      </Drawer>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex', width: 240 },
          justifyContent: 'space-between',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {drawerContent}
      </Box>
    </>
  );
}
