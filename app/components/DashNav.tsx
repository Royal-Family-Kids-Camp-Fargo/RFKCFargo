import { Link, useLocation, useNavigate, matchPath } from 'react-router';
import { useState } from 'react';
import pipelineApi, { type Pipeline } from '~/api/objects/pipeline';
import formApi, { type Form } from '~/api/objects/form';
import { authStore } from '~/stores/authStore.client';
import { Button } from '~/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';
import {
  Home,
  Workflow,
  BellRing,
  MessageSquareMore,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '~/components/ui/collapsible';
import type { User } from '~/api/objects/user';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type DashNavProps = {
  user: User;
  pipelines: Pipeline[];
  forms: Form[];
  sideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

export default function DashNav({
  pipelines,
  user,
  forms,
  sideBarOpen,
  setSideBarOpen,
  isMobile,
}: DashNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openPipelines, setOpenPipelines] = useState(false);
  const initials = user.first_name.charAt(0) + user.last_name.charAt(0);

  const handleClick = async () => {
    await authStore.logout();
    navigate('/sign-in');
  };

  const NavContent = () => (
    <div className="flex flex-col flex-1 gap-2 p-4">
      <div className="w-full justify-start h-16 px-4 flex items-center gap-2">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[128px]">
            {user.email}
          </p>
        </div>
      </div>
      <nav aria-label="Main Navigation">
        <ul className="flex flex-col space-y-1" role="list">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start aria-[current=page]:bg-accent"
              asChild
              aria-current={
                matchPath(location.pathname, '/dashboard') ? 'page' : undefined
              }
            >
              <Link to="/dashboard">
                <Home aria-hidden="true" />
                <span>Home</span>
              </Link>
            </Button>
          </li>

          <li>
            <Collapsible open={openPipelines} onOpenChange={setOpenPipelines}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  aria-expanded={openPipelines}
                >
                  <Workflow aria-hidden="true" />
                  <span>Pipelines</span>
                  {openPipelines ? (
                    <ChevronUp className="ml-auto" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="ml-auto" aria-hidden="true" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6">
                {pipelines.map((pipeline) => (
                  <Button
                    key={pipeline.id}
                    variant="ghost"
                    className="w-full justify-start aria-[current=page]:bg-accent"
                    asChild
                    aria-current={
                      matchPath(
                        location.pathname,
                        `/dashboard/pipelines/${pipeline.id}`
                      )
                        ? 'page'
                        : undefined
                    }
                  >
                    <Link to={`/dashboard/pipelines/${pipeline.id}`}>
                      {pipeline.name}
                    </Link>
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </li>

          <li>
            <Button
              variant="ghost"
              className="w-full justify-start aria-[current=page]:bg-accent"
              asChild
              aria-current={
                matchPath(location.pathname, '/dashboard/announcements')
                  ? 'page'
                  : undefined
              }
            >
              <Link to="/dashboard/announcements">
                <BellRing aria-hidden="true" />
                <span>Announcements</span>
              </Link>
            </Button>
          </li>

          <li>
            <Button
              variant="ghost"
              className="w-full justify-start aria-[current=page]:bg-accent"
              asChild
              aria-current={
                matchPath(location.pathname, '/dashboard/sms-templates')
                  ? 'page'
                  : undefined
              }
            >
              <Link to="/dashboard/sms-templates">
                <MessageSquareMore aria-hidden="true" />
                <span>SMS Templates</span>
              </Link>
            </Button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClick}
          aria-label="Logout"
        >
          <LogOut aria-hidden="true" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {sideBarOpen && (
        <>
          {isMobile && (
            <Sheet open={sideBarOpen} onOpenChange={setSideBarOpen}>
              <SheetContent
                side="left"
                className="w-[240px] p-2 h-full border flex flex-col"
                role="navigation"
                aria-label="Mobile navigation"
              >
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <NavContent />
              </SheetContent>
            </Sheet>
          )}

          <div className="hidden md:flex w-[240px] border-r flex-col">
            <NavContent />
          </div>
        </>
      )}
    </>
  );
}
