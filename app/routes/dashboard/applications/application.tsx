import type { Route } from './+types/application';

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  return { id: params.id };
}

export default function Application({ loaderData }: Route.ComponentProps) {
  const id = loaderData.id;
  return <div>Application {id}</div>;
}
