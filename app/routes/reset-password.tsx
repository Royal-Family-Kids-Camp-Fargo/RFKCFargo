import type { Route } from './+types/reset-password';
import { useFetcher } from 'react-router';
import { Link as RouterLink } from 'react-router';
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
import { validateDeviiToken } from '~/lib/utils';
import { refresh, resetPassword } from '~/api/sessions';
import { isApolloError } from '@apollo/client/errors';
import InvalidResetLink from '~/components/auth/InvalidResetLink';
import PasswordResetSuccess from '~/components/auth/PasswordResetSuccess';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reset Password' },
    { name: 'description', content: 'Reset your password' },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const token = url.searchParams.get('rst') as string;
  const decodedToken = validateDeviiToken(token);
  if (decodedToken) {
    localStorage.setItem(
      'auth',
      JSON.stringify({ access_token: token, roleid: decodedToken.roleid })
    );
  }

  const res = await refresh(token, false);

  const accessToken = res.access_token;

  return { accessToken, ...decodedToken, error: res.error };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const token = formData.get('token') as string;
  const roleid = Number(formData.get('roleid'));
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' };
  }

  try {
    const res = await resetPassword(token, roleid, password);

    return { success: true };
  } catch (error) {
    if (isApolloError(error as Error)) {
      const apolloError = error as {
        networkError?: { result?: { error?: string } };
      };
      return {
        error:
          apolloError.networkError?.result?.error ?? 'Unknown error occurred',
      };
    }
    return {
      error:
        'An error occurred while resetting your password. Please try again.',
    };
  }
}

export default function ResetPassword({ loaderData }: Route.ComponentProps) {
  const { accessToken, roleid, tenantid, error: loaderError } = loaderData;
  const fetcher = useFetcher();
  const error = fetcher.data?.error;

  if (!roleid || !tenantid || loaderError) {
    return <InvalidResetLink />;
  }

  if (fetcher.data?.success) {
    return <PasswordResetSuccess />;
  }

  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4">
      <RfkCentralIcon />
      <Card className="w-[350px] border-none shadow-none">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <fetcher.Form method="post" name="reset-password">
          <CardContent className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <input type="hidden" name="token" value={accessToken} />
            <input type="hidden" name="roleid" value={roleid} />
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your new password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your new password"
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
                  Resetting password...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              <RouterLink
                to="/sign-in"
                className="text-primary hover:underline"
              >
                Back to Sign In
              </RouterLink>
            </p>
          </CardFooter>
        </fetcher.Form>
      </Card>
    </div>
  );
}
