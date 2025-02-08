import type { Route } from './+types/home';
import { redirect, useFetcher, useSearchParams } from 'react-router';
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
import { requestPasswordReset } from '~/api/sessions';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Forgot Password' },
    { name: 'description', content: 'Reset your password' },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  console.log(email);
  const res = await requestPasswordReset(email);
  if (!res) {
    return { error: 'An error occured while requesting your password reset.' };
  }
  return redirect('/forgot-password?success=true');
}

export default function ForgotPassword({}) {
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success') === 'true';

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center flex-col gap-4">
        <RfkCentralIcon />
        <Card className="w-[350px] border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-center">You've got mail! ✉️</CardTitle>
            <CardDescription className="text-center">
              Your password reset link has been sent.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <RouterLink to="/sign-in" className="w-full">
              <Button className="w-full" variant="outline">
                Return to Sign In
              </Button>
            </RouterLink>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4">
      <RfkCentralIcon />
      <Card className="w-[350px] border-none shadow-none">
        <CardHeader>
          <CardTitle>Forgot password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <fetcher.Form method="post" name="forgot-password">
          <CardContent className="space-y-4">
            {fetcher.data?.error && (
              <p className="text-sm text-destructive">
                Something went wrong. Please try again.
              </p>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              type="submit"
              disabled={fetcher.state !== 'idle'}
            >
              {fetcher.state !== 'idle' ? (
                <>
                  <Loader2 className="animate-spin" />
                  Sending link...
                </>
              ) : (
                'Send link'
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
