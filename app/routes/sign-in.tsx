import type { Route } from './+types/home';
import { redirect, useFetcher } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { authStore } from '~/stores/authStore.client';
import { login } from '~/api/sessions';
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
import { UserApi } from '~/api/objects/user';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign In' },
    { name: 'description', content: 'Sign in to your account' },
  ];
}

export async function clientLoader() {
  const auth = authStore.getAuth();
  const accessToken = auth ? auth.access_token : null;
  const roleid = auth ? auth.roleid : null;
  if (accessToken && roleid) {
    let user = authStore.getUser();

    if (!user) {
      const userResponse = await new UserApi(accessToken).get(roleid);
      if ('error' in userResponse) {
        return;
      }
      user = userResponse.data;
      authStore.setUser(user);
    }

    return redirect('/dashboard');
  }

  return;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  try {
    const {
      user: { data: user },
      access_token,
      roleid,
    } = await login(
      formData.get('email') as string,
      formData.get('password') as string
    );
    authStore.setAuth({
      access_token,
      roleid,
    });
    authStore.setUser(user);
    return redirect('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    return { error: 'Login failed' };
  }
}

export default function SignIn() {
  const fetcher = useFetcher();

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
        <fetcher.Form method="post" name="sign-in">
          <CardContent className="space-y-4">
            {fetcher.data?.error && (
              <p className="text-sm text-destructive">{fetcher.data.error}</p>
            )}
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
            <Button
              className="w-full"
              type="submit"
              disabled={fetcher.state === 'submitting'}
            >
              {fetcher.state === 'submitting' ? (
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
        </fetcher.Form>
      </Card>
    </div>
  );
}
