import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'The NLAPI' },
    { name: 'description', content: 'The NLAPI' },
  ];
}

export default function Home() {
  return <div>Home</div>;
}
