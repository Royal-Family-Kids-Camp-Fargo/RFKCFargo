import { authStore } from "~/stores/authStore";
import type { Route } from "./+types/index";
import { Outlet, redirect } from "react-router";
import {
  Box,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
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
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </TopNav>
        <Divider />
        <Box sx={{ display: "flex", border: "1px solid green" }} flexGrow={1}>
          <Box
            sx={{
              position: { xs: "absolute", md: "static" },
              height: { xs: "calc(100vh - 64px)", md: "auto" },
              backgroundColor: "background.paper",
              zIndex: { xs: 1200, md: "auto" },
              boxShadow: { xs: 4, md: 0 },
              right: { xs: 0, md: "auto" },
              transition: "transform 0.3s ease-in-out",
              transform: {
                xs: isNavOpen ? "translateX(0)" : "translateX(100%)",
                md: "none",
              },
              width: { xs: "240px", md: "auto" },
            }}
          >
            <DashNav pipelines={pipelines} forms={forms} />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box component="main" flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
      </>
    );
  }
  return <div>Loading...</div>;
}
