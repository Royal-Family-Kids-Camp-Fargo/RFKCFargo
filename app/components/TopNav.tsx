import { Avatar, Box, Typography, IconButton, Stack } from '@mui/material';
import type { User } from '~/api/objects/user';

type TopNavProps = {
  user?: User;
  children?: React.ReactNode;
};

export function TopNav({ user, children }: TopNavProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ padding: 2 }}
      gap={2}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        RFK CENTRAL
      </Typography>
      <Stack direction="row" alignItems="center" gap={2}>
        {children}
        <Avatar
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {user ? user.first_name?.charAt(0) : ''}
          {user ? user.last_name?.charAt(0) : ''}
        </Avatar>
      </Stack>
    </Stack>
  );
}
