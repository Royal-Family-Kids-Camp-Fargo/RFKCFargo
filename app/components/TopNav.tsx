import { Avatar, Box, Typography } from '@mui/material';

import type { User } from '~/api/objects/user';

type TopNavProps = {
  user?: User;
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
      <Typography variant="h6">RFKCFARGO</Typography>
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
    </Box>
  );
}
