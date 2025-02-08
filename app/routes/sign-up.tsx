import { Form, redirect, useNavigation } from 'react-router';
import { Link as RouterLink } from 'react-router';
import { signup } from '~/api/sessions';
import { Button } from '~/components/ui/button';
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
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Sign Up' },
    { name: 'description', content: 'Sign up for an account' },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const res = await signup(
    formData.get('email') as string,
    formData.get('password') as string,
    formData.get('name') as string
  );

  if (res.status !== 200) {
    return redirect('/sign-up');
  }

  return redirect('/dashboard');
}

export default function SignUp() {
  const navigation = useNavigation();
  const isNavigating = navigation.formAction === '/sign-up';

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card className="w-[350px] border-none">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <Form method="post" name="sign-up">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
              />
            </div>
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
                placeholder="Create a password"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isNavigating}>
              {isNavigating ? 'Creating account...' : 'Sign up'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <RouterLink
                to="/sign-in"
                className="text-primary hover:underline"
              >
                Sign in
              </RouterLink>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </div>
  );
}
