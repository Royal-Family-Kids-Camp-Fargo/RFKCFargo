import type { Route } from './+types/home';
import { Form, redirect, useNavigation } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { authStore } from '~/stores/authStore.client';
import { login, refresh } from '~/api/sessions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Button } from '~/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RfkCentralIcon } from '~/components/icons/RfkCentralIcon';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign In' },
    { name: 'description', content: 'Sign in to your account' },
  ];
}

export async function clientLoader() {
  let accessToken = authStore.getAuth();
  if (accessToken) {
    return redirect('/dashboard');
  }

  await refresh();

  accessToken = authStore.getAuth();
  console.log('accessToken from sign-in', accessToken);
  if (accessToken) {
    return redirect('/dashboard');
  }

  return;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  try {
    const res = await login(
      formData.get('email') as string,
      formData.get('password') as string
    );
    authStore.setAuth({
      access_token: res.access_token,
      roleid: res.user.role.roleid,
    });
    authStore.setUser(res.user);
    console.log(authStore.getAuth());
    return redirect('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    return redirect('/sign-in');
  }
}

export default function SignIn() {
  const navigation = useNavigation();
  const isNavigating = navigation.formAction === '/sign-in';

  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4">
      <RfkCentralIcon />
      <Card className="w-[350px] border-none shadow-none">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <Form method="post" name="sign-in">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isNavigating}>
              {isNavigating ? (
                <>
                  <Loader2 className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              <RouterLink
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </RouterLink>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
