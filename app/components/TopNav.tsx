import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '~/components/ui/breadcrumb';
import { Menu } from 'lucide-react';
import type { User } from '~/api/objects/user';
import { RfkCentralIcon } from './icons/RfkCentralIcon';

type TopNavProps = {
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function TopNav({ setSideBarOpen }: TopNavProps) {
  return (
    <div className="flex py-2 items-center px-4 gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          setSideBarOpen((prev) => {
            console.log('prev', prev);
            return !prev;
          })
        }
      >
        <Menu />
      </Button>

      {/* Breadcrumbs */}
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Current Page</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <RfkCentralIcon height={32} width={32} />
    </div>
  );
}
