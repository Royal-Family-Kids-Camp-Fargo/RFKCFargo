import { Stack, Typography, Button } from '@mui/material';
import { Link } from 'react-router';

export function HomeNav() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ padding: 2 }}
      gap={2}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        RFKC Fargo
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/sign-in"
      >
        RFK Central
      </Button>
    </Stack>
  );
}
