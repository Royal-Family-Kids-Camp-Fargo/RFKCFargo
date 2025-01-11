import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import type { Route } from "./+types/home";
import { Form, redirect, useNavigation } from "react-router";
import { Link as RouterLink } from "react-router";
import { signup } from "~/api/sessions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Sign up for an account" },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
  console.log(data);

  const res = await signup(
    formData.get("email") as string,
    formData.get("password") as string,
    formData.get("name") as string
  );

  if (res.status !== 200) {
    return redirect("/sign-up");
  }

  return redirect("/dashboard");
}

export default function SignUp() {
  const navigation = useNavigation();
  const isNavigating = navigation.formAction === "/sign-up";
  return (
    <Box
      border="1px solid blue"
      flexGrow={1}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h5" fontWeight="bold">
        Sign up
      </Typography>
      <Form method="post" name="sign-up">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          width="280px"
        >
          <TextField type="text" label="Name" name="name" fullWidth />
          <TextField
            type="email"
            label="Email"
            name="email"
            required
            fullWidth
          />
          <TextField
            type="password"
            label="Password"
            name="password"
            required
            fullWidth
          />
          <Button
            startIcon={
              isNavigating ? <CircularProgress size="1rem" /> : undefined
            }
            disabled={isNavigating}
            size="large"
            type="submit"
            variant="contained"
            fullWidth
          >
            Sign up
          </Button>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/sign-in">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Form>
    </Box>
  );
}
