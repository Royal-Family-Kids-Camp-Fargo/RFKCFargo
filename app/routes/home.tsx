import type { Route } from './+types/home';
import {
  Box,
  Container,
  Typography,
  Grid2,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { TopNav } from '../components/TopNav';
import { authStore } from '../stores/authStore';
import { Link } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'RFK Central' },
    { name: 'description', content: 'RFK Central' },
  ];
}

export default function Home() {
  const user = authStore.getUser();

  return (
    <>
      <TopNav user={user}>
        <Button component={Link} to="/sign-in">
          Sign in
        </Button>
      </TopNav>
      <Container maxWidth={false}>
        <Box
          sx={{
            backgroundImage: 'url("/2025-banner.jpg")',
            backgroundColor: '#ffffff',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            padding: (theme) => theme.spacing(8, 4),
            marginBottom: (theme) => theme.spacing(4),
            position: 'relative',
            width: '100%',
            height: 400,
          }}
        />

        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ color: 'primary.main' }}
          >
            Welcome to Royal Family Kids Camp
          </Typography>
          <Typography variant="h6" color="text.secondary" mt={2}>
            Join our community of volunteers and supporters making a difference
            in children's lives.
          </Typography>
        </Box>

        <Grid2 container spacing={4} justifyContent="center">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                transition:
                  'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  color="secondary.main"
                  gutterBottom
                >
                  Join Our Volunteer Team
                </Typography>
                <Typography variant="body1" mb={3}>
                  Help us create a safe, fun, and unforgettable camp experience
                  for children who need it most.
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* TODO: Make this link dynamic per location, but hardcode Fargo for now */}
                  <Button
                    variant="contained"
                    fullWidth
                    component="a"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdJROfy0S53UwLY449Z6L2zjNvpDVvlrBDyHGGmYOvhbyjhyA/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    New Volunteer Registration
                  </Button>
                  {/* TODO: Make this link dynamic per location, but hardcode Fargo for now */}
                  <Button
                    variant="outlined"
                    fullWidth
                    component="a"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeyYwuMEluMzOC8QXoXbzBdhtGY6KKoByFuSg_3cLjsGycQRg/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Returning Volunteer Registration
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                transition:
                  'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  color="secondary.main"
                  gutterBottom
                >
                  Interested in Donating?
                </Typography>
                <Typography variant="body1" mb={3}>
                  Your support helps kids have a chance to simply be kids, have
                  fun, and know there are adults who care. Together, we can make
                  lasting memories and foster brighter futures.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  component="a"
                  href="https://rivercityfargo.org/ftcfargo/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Make a Donation
                </Button>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      </Container>
    </>
  );
}
