import {
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from '@mui/material';
import type { BoxProps } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import { Link, useLocation, useNavigate } from 'react-router';
// import { logout } from '~/lib/auth';

export default function DashNav(props: BoxProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = async () => {
    // await logout();
    navigate('/sign-in');
  };

  return (
    <Box {...props}>
      <List>
        <ListItem>
          <ListItemButton
            component={Link}
            to="/dashboard/applications"
            selected={location.pathname === '/dashboard/applications'}
          >
            <ListItemIcon>
              <AppsIcon />
            </ListItemIcon>
            <ListItemText>Applications</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
      <Button onClick={handleClick}>Logout</Button>
    </Box>
  );
}
