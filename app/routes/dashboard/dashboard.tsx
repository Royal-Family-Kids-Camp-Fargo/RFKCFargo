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
import { useState, createContext, useContext, useEffect } from "react";
import type { User } from "~/api/objects/user";
import userApi from "~/api/objects/user";
import ChatBubble from "~/components/chat/ChatBubble";
import { botContextStore } from "~/stores/botContextStore";


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
    authStore.logout();
    return redirect("/sign-in");
  }
  if (!user) {
    console.log("Getting user");
    const result = await userApi.get(auth.roleid);
    if ("message" in result) {
      console.error("Error getting user", result);
      authStore.logout();
      return redirect("/sign-in");
    }
    user = result;
    console.log("user", user);
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
  // For adding more context to your AI store
  const addBotContext = botContextStore.addContext;
  const removeBotContext = botContextStore.removeContext;

  useEffect(() => {
    if (loaderData && "user" in loaderData) {
      const { user } = loaderData as LoaderData;
      const context = `User is logged in with id: ${user.id}`;
      const locationContext = `User's location id is: ${user.location_id}; Any users added by this user will be in this location`;
      addBotContext(context);
      addBotContext(locationContext);

      return () => {
        removeBotContext(context);
        removeBotContext(locationContext);
      };
    }
  }, [loaderData]);

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
          <ChatBubble />
        </Box>
      </>
    );
  }
  return <div>Loading...</div>;
}
