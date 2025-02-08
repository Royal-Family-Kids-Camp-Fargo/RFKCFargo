import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  // route("sign-up", "routes/sign-up.tsx"),
  route('sign-in', 'routes/sign-in.tsx'),
  route('forgot-password', 'routes/forgot-password.tsx'),
  route('reset-password', 'routes/reset-password.tsx'),
  route('dashboard', 'routes/dashboard/dashboard.tsx', [
    route(
      'pipelines/:pipelineId',
      'routes/dashboard/pipelines/ViewPipeline.tsx'
    ),
    route('forms/:id', 'routes/dashboard/forms/ViewForm.tsx'),
    route('announcements', 'routes/dashboard/announcements/announcements.tsx'),
    route('sms-templates', 'routes/dashboard/sms-templates/sms-templates.tsx'),
  ]),
] satisfies RouteConfig;
