import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Link as RouterLink } from 'react-router';
import { RfkCentralIcon } from '~/components/icons/RfkCentralIcon';

export default function PasswordResetSuccess() {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4">
      <RfkCentralIcon />
      <Card className="w-[350px] border-none shadow-none">
        <CardHeader>
          <CardTitle>Password Reset Success</CardTitle>
          <CardDescription>
            Your password has been reset successfully. You can now sign in to
            your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <RouterLink to="/sign-in" className="w-full">
            <Button className="w-full" variant="outline">
              Sign In
            </Button>
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  );
}
