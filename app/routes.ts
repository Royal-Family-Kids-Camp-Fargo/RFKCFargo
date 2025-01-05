import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('sign-up', 'routes/sign-up.tsx'),
  route('sign-in', 'routes/sign-in.tsx'),
  route('dashboard', 'routes/dashboard/index.tsx', [
    route('pipeline/:id', 'routes/dashboard/pipelines/ViewPipeline.tsx'),
    route('form/:id', 'routes/dashboard/forms/ViewForm.tsx')
  ]),
] satisfies RouteConfig;
