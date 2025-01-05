import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { useDashboard } from '~/routes/dashboard/dashboard';
import type { User } from '~/api/objects/user';
import MenuIcon from '@mui/icons-material/Menu';

type TopNavProps = {
  user?: User;
};

export function TopNav(props: TopNavProps) {
  const { isNavOpen, setIsNavOpen } = useDashboard();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
      }}
    >
      <Typography variant="h6">RFK CENTRAL</Typography>
      <Avatar
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        {props.user
          ? props.user.first_name
          : ''}
        {props.user
          ? props.user.last_name
          : ''}
      </Avatar>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setIsNavOpen(!isNavOpen)}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>
    </Box>
  );
}
