import {
  Box,
  Button,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import type { Route } from './+types/home';
import { Form, redirect, useNavigation } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { authStore } from '~/stores/auth-store';
import { login, refresh } from '~/api/sessions';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign In' },
    { name: 'description', content: 'Sign in to your account' },
  ];
}

export async function clientLoader() {
  let accessToken = authStore.getAccessToken();
  if (accessToken) {
    return redirect('/dashboard');
  }

  await refresh();

  accessToken = authStore.getAccessToken();
  if (accessToken) {
    return redirect('/dashboard');
  }

  return;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const res = await login(
    formData.get('email') as string,
    formData.get('password') as string
  );

  if (res.status !== 200) {
    return redirect('/sign-in');
  }

  const json = await res.json();

  authStore.setAccessToken(json.access_token);
  authStore.setDeveloper({
    id: json.developer.id,
    email: json.developer.email,
    name: json.developer.name,
    roleId: json.developer.role_id,
  });
  console.log(authStore.getAccessToken());
  return redirect('/dashboard');
}

export default function SignUp() {
  const navigation = useNavigation();
  const isNavigating = navigation.formAction === '/sign-in';
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
        Sign in
      </Typography>
      <Form method="post" name="sign-in">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          width="280px"
        >
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
            Sign in
          </Button>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/sign-up">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Form>
    </Box>
  );
}
