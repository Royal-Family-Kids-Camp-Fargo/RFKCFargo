import { Box, Typography } from '@mui/material';

export default function ViewPipeline() {
  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" component="h1">
        View Pipeline
      </Typography>
      <Typography variant="body1" color="text.secondary" mt={2}>
        This is a placeholder for the View Pipeline page.
      </Typography>
    </Box>
  );
}
