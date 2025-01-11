import { authStore } from "~/stores/authStore";
import type { Route } from "./+types/index";
import { Outlet, redirect } from "react-router";
import {
  Box,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import { TopNav } from "~/components/TopNav";
import DashNav from "~/components/DashNav";
import pipelineApi, { type Pipeline } from "~/api/objects/pipeline";
import formApi, { type Form } from "~/api/objects/form";
// import { refresh } from '~/lib/auth';
import MenuIcon from "@mui/icons-material/Menu";
import { useState, createContext, useContext } from "react";
import type { User } from "~/api/objects/user";
import userApi from "~/api/objects/user";

type LoaderData = {
  user: User;
  pipelines: Pipeline[];
  forms: Form[];
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  let auth =
    authStore.getAuth() || JSON.parse(localStorage.getItem("auth") || "{}");
  authStore.setAuth(auth);
  let user = authStore.getUser();
  console.log("auth", auth);
  if (!auth.access_token) {
    console.log("No auth");
    return redirect("/sign-in");
  }
  if (!user) {
    console.log("Getting user");
    user = await userApi.get(auth.roleid);
    authStore.setUser(user);
  }

  // Add the pipelines and forms fetch
  const [pipelines, forms] = await Promise.all([
    pipelineApi.getAll({ limit: 100, offset: 0, ordering: "", filter: "" }),
    formApi.getAll({ limit: 100, offset: 0, ordering: "", filter: "" }),
  ]);

  return { user, pipelines: pipelines.data, forms: forms.data };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isNavOpen, setIsNavOpen] = useState(false);

  if ("user" in loaderData) {
    const { user, pipelines, forms } = loaderData as LoaderData;

    return (
      <>
        <TopNav user={user}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </TopNav>
        <Divider />

        {isMobile && (
          <Drawer
            anchor="right"
            open={isNavOpen}
            onClose={() => setIsNavOpen(false)}
            variant="temporary"
            sx={{
              "& .MuiDrawer-paper": {
                width: 240,
              },
            }}
          >
            <DashNav pipelines={pipelines} forms={forms} />
          </Drawer>
        )}

        {!isMobile && (
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <DashNav pipelines={pipelines} forms={forms} />
          </Box>
        )}

        <Box flexGrow={1}>
          <Outlet />
        </Box>
      </>
    );
  }
  return <div>Loading...</div>;
}
