import {
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import type { BoxProps } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useLocation, useNavigate, useLoaderData } from "react-router";
import { useState } from "react";
import pipelineApi, { type Pipeline } from "~/api/objects/pipeline";
import formApi, { type Form } from "~/api/objects/form";

// Loader function to fetch both pipelines and forms
export async function loader() {
  const [pipelines, forms] = await Promise.all([
    pipelineApi.getAll({ limit: 100, offset: 0, ordering: "", filter: "" }),
    formApi.getAll({ limit: 100, offset: 0, ordering: "", filter: "" }),
  ]);

  return { pipelines: pipelines.data, forms: forms.data };
}

type LoaderData = {
  pipelines: Pipeline[];
  forms: Form[];
};

type DashNavProps = BoxProps & {
  pipelines: Pipeline[];
  forms: Form[];
};

export default function DashNav({ pipelines, forms, ...props }: DashNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openPipelines, setOpenPipelines] = useState(false);
  const [openForms, setOpenForms] = useState(false);

  const handleClick = async () => {
    // await logout();
    navigate("/sign-in");
  };

  return (
    <Box {...props}>
      <List>
        <ListItem>
          <ListItemButton onClick={() => setOpenPipelines(!openPipelines)}>
            <ListItemIcon>
              <AccountTreeIcon />
            </ListItemIcon>
            <ListItemText primary="Pipelines" />
            {openPipelines ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        {openPipelines && (
          <List component="div" disablePadding>
            {pipelines.map((pipeline) => (
              <ListItemButton
                key={pipeline.id}
                sx={{ pl: 4 }}
                component={Link}
                to={`/dashboard/pipelines/${pipeline.id}`}
                selected={
                  location.pathname === `/dashboard/pipelines/${pipeline.id}`
                }
              >
                <ListItemText primary={pipeline.name} />
              </ListItemButton>
            ))}
          </List>
        )}

        <ListItem>
          <ListItemButton onClick={() => setOpenForms(!openForms)}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Forms" />
            {openForms ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        {openForms && (
          <List component="div" disablePadding>
            {forms.map((form) => (
              <ListItemButton
                key={form.id}
                sx={{ pl: 4 }}
                component={Link}
                to={`/dashboard/forms/${form.id}`}
                selected={location.pathname === `/dashboard/forms/${form.id}`}
              >
                <ListItemText primary={form.name} />
              </ListItemButton>
            ))}
          </List>
        )}
      </List>
      <Button onClick={handleClick}>Logout</Button>
    </Box>
  );
}
