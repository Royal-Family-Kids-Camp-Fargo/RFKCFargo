import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-in", "routes/sign-in.tsx"),
  route("dashboard", "routes/dashboard/dashboard.tsx", [
    route(
      "pipelines/:pipelineId",
      "routes/dashboard/pipelines/ViewPipeline.tsx"
    ),
    route("forms/:id", "routes/dashboard/forms/ViewForm.tsx"),
    route("announcements", "routes/dashboard/announcements/announcements.tsx"),
  ]),
] satisfies RouteConfig;
