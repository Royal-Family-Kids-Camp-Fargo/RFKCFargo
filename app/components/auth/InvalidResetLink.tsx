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

export default function InvalidResetLink() {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4">
      <RfkCentralIcon />
      <Card className="w-[350px] border-none shadow-none">
        <CardHeader>
          <CardTitle>Invalid or Expired Link</CardTitle>
          <CardDescription>
            This password reset link is invalid or has expired. Please request a
            new one.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-4">
          <RouterLink to="/forgot-password" className="w-full">
            <Button className="w-full" variant="outline">
              Request New Link
            </Button>
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  );
}
