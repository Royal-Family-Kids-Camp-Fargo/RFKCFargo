import { Avatar } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { Menu } from 'lucide-react';
import type { User } from '~/api/objects/user';
import { RfkCentralIcon } from './icons/RfkCentralIcon';
import { Link, useLocation } from 'react-router';

type TopNavProps = {
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Breadcrumb = {
  label: string;
  path: string;
};

export function TopNav({ setSideBarOpen }: TopNavProps) {
  const location = useLocation();
  const breadcrumbs = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems: Breadcrumb[] = [];

  for (let i = 0; i < breadcrumbs.length; i++) {
    const breadcrumb = breadcrumbs[i];
    const path = breadcrumbs.slice(0, i + 1).join('/');
    breadcrumbItems.push({
      label: breadcrumb.charAt(0).toUpperCase() + breadcrumb.slice(1),
      path: `/${path}`,
    });
  }

  console.log(breadcrumbItems);

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
          <BreadcrumbList>
            {breadcrumbItems.map((breadcrumb, index) => (
              <>
                <BreadcrumbItem key={index}>
                  <BreadcrumbLink asChild>
                    <Link to={breadcrumb.path}>{breadcrumb.label}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <RfkCentralIcon height={32} width={32} />
    </div>
  );
}
