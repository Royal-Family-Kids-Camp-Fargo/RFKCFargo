import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('sign-up', 'routes/sign-up.tsx'),
  route('sign-in', 'routes/sign-in.tsx'),
  route('dashboard', 'routes/dashboard/index.tsx', [
    route('applications', 'routes/dashboard/applications/index.tsx'),
    route('applications/:id', 'routes/dashboard/applications/application.tsx', [
      route('calls', 'routes/dashboard/applications/calls.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
