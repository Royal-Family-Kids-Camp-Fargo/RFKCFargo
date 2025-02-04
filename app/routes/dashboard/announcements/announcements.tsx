import { Outlet } from 'react-router';
import { MessageSquare, Copy } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { toast } from 'sonner';

export default function Announcements() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      'https://app.givingheartsday.org/#/charity/1870'
    );
    console.log('Link copied to clipboard');
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Announcement Title */}
      <Card>
        <CardHeader>
          <CardTitle>Giving Hearts Day</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Giving Hearts Day Charity Page:
            https://app.givingheartsday.org/#/charity/1870
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCopyLink} className="w-full">
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </CardFooter>
      </Card>

      <Separator className="my-4" />

      <h2 className="text-2xl font-semibold">Sample texts to send</h2>

      {/* Text for People Who Know About Camp */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            To people who know about camp...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Right now, every donation to Royal Family Kids Fargo is matched
            dollar-for-dollar up to $5,500. If you are in a position to give
            we'd certainly appreciate it! Here's the link to donate:
            https://app.givingheartsday.org/#/charity/1870
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="default" asChild className="w-full">
            <a
              href="sms:?&body=Right now, every donation to Royal Family Kids Fargo is matched dollar-for-dollar up to $5,500. If you are in a position to give we'd certainly appreciate it! Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
            >
              <MessageSquare className="h-4 w-4" />
              Send Text
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Text for Past Volunteers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">To past volunteers...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Right now, every donation to Royal Family Kids Camp is matched
            dollar-for-dollar up to $5,500. Would you be open to sharing a link
            to donate with 5 people you know? I'll send you a text you can
            forward along. (You can obvs make changes as necessary)
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="default" asChild className="w-full">
            <a
              href="sms:?&body=Right now, every donation to Royal Family Kids Camp is matched dollar-for-dollar up to $5,500. Would you be open to sharing a link to donate with 5 people you know? I'll send you a text you can forward along. (You can obvs make changes as necessary) Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
            >
              <MessageSquare className="h-4 w-4" />
              Share Link
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Text for Past Volunteers to share with their friends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            To past volunteers to share with their friends...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            A camp I volunteered at last summer for kids who've experienced
            abuse / neglect currently has donors willing to match donations up
            to $5,500. Would you consider donating? The organization is 100%
            volunteer run meaning all proceeds go to the camp. Here is a link:
            https://app.givingheartsday.org/#/charity/1870
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="default" asChild className="w-full">
            <a
              href="sms:?&body=A camp I volunteered at last summer for kids who've experienced abuse / neglect currently has donors willing to match donations up to $5,500. Would you consider donating? The organization is 100% volunteer run meaning all proceeds go to the camp. Here is a link: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
            >
              <MessageSquare className="h-4 w-4" />
              Send Text
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Text for People Who Don't Know About Camp */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            To people who don't know about camp...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            A camp I help plan every year called Royal Family Kids (a camp for
            abused/neglected kids) currently has generous donors willing to
            match up to $5500. If you are in a position to donate, we'd really
            appreciate the support. 100% of proceeds goes to making the camp
            special for the kids as we all volunteer our time to make it happen.
            Are you open to sending you a link to donate? (every little bit
            helps)
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="default" asChild className="w-full">
            <a
              href="sms:?&body=A camp I help plan every year called Royal Family Kids (a camp for abused/neglected kids) currently has generous donors willing to match up to $5500. If you are in a position to donate, we'd really appreciate the support. 100% of proceeds goes to making the camp special for the kids as we all volunteer our time to make it happen. Are you open to sending you a link to donate? (every little bit helps) Here's the link to donate: https://app.givingheartsday.org/#/charity/1870"
              target="_blank"
            >
              <MessageSquare className="h-4 w-4" />
              Send Text
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Outlet for Nested Routes */}
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
