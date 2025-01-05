import { Avatar, Box, Typography } from '@mui/material';

import type { Developer } from '../stores/auth-store';

type TopNavProps = {
  developer?: Developer;
};

export function TopNav(props: TopNavProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
      }}
    >
      <Typography variant="h6">NLAPI</Typography>
      <Avatar
        sx={{
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        {props.developer
          ? props.developer.name.toUpperCase().split(' ')[0][0]
          : ''}
        {props.developer
          ? props.developer.name.toUpperCase().split(' ')[1][0]
          : ''}
      </Avatar>
    </Box>
  );
}
