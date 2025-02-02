import type { Route } from "./+types/home";
import {
  Box,
  Container,
  Typography,
  Grid2,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { TopNav } from "../components/TopNav";
import { authStore } from "../stores/authStore";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RFK Central" },
    { name: "description", content: "RFK Central" },
  ];
}

export default function Home() {
  const user = authStore.getUser();

  return (
    <>
      <TopNav user={user}>
        <NavLink to="/sign-in">Sign In</NavLink>
      </TopNav>
      <Container maxWidth={false}>
        <Box
          sx={{
            backgroundImage: 'url("/2025-banner.jpg")',
            backgroundColor: "#ffffff",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            padding: (theme) => theme.spacing(8, 4),
            marginBottom: (theme) => theme.spacing(4),
            position: "relative",
            width: "100%",
            height: 400,
          }}
        />

        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1">
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
              sx={{
                height: "100%",
                backgroundColor: "#ffe6e6",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  color="#cc0000"
                  gutterBottom
                >
                  Join Our Volunteer Team
                </Typography>
                <Typography variant="body1" color="#4b0082" mb={3}>
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
                    sx={{
                      backgroundColor: "#4b0082",
                      borderColor: "#4b0082",
                      fontSize: "0.9rem",
                      borderRadius: 0.75,
                      py: 0.5,
                      px: 1,
                      "&:hover": {
                        backgroundColor: "#3c0066",
                        borderColor: "#3c0066",
                      },
                    }}
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
                    sx={{
                      backgroundColor: "#4b0082",
                      borderColor: "#4b0082",
                      fontSize: "0.9rem",
                      borderRadius: 0.75,
                      py: 0.5,
                      px: 1,
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#3c0066",
                        borderColor: "#3c0066",
                      },
                    }}
                  >
                    Returning Volunteer Registration
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#ffe6e6",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: (theme) => theme.shadows[4],
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 4 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  color="#cc0000"
                  gutterBottom
                >
                  Interested in Donating?
                </Typography>
                <Typography variant="body1" color="#4b0082" mb={3}>
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
                  sx={{
                    backgroundColor: "#4b0082",
                    borderColor: "#4b0082",
                    fontSize: "0.9rem",
                    borderRadius: 0.75,
                    py: 0.5,
                    px: 1,
                    "&:hover": {
                      backgroundColor: "#3c0066",
                      borderColor: "#3c0066",
                      boxShadow: "0 0 3px 1px #20c997",
                      transition: "0.7s",
                    },
                  }}
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
