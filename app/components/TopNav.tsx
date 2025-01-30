import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Stack,
  AppBar,
  Toolbar,
} from '@mui/material';
import type { User } from '~/api/objects/user';
import MenuIcon from '@mui/icons-material/Menu';

type TopNavProps = {
  user?: User;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export function TopNav({ user, mobileOpen, setMobileOpen }: TopNavProps) {
  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <IconButton
          sx={{
            mr: 2,
            display: { xs: 'block', md: 'none' },
            minWidth: 48,
            maxWidth: 48,
          }}
          onClick={() => setMobileOpen(true)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, flexGrow: 1, color: 'primary.main' }}
        >
          RFK CENTRAL
        </Typography>
        <Avatar
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {user ? user.first_name?.charAt(0) : ''}
          {user ? user.last_name?.charAt(0) : ''}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
