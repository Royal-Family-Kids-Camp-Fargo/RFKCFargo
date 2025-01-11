import { Avatar, Box, Typography, IconButton } from "@mui/material";
import type { User } from "~/api/objects/user";

type TopNavProps = {
  user?: User;
  children?: React.ReactNode;
};

export function TopNav({ user, children }: TopNavProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
      }}
    >
      <Typography variant="h6">RFK CENTRAL</Typography>
      <Avatar
        sx={{
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        {user ? user.first_name.charAt(0) : ""}
        {user ? user.last_name.charAt(0) : ""}
      </Avatar>
      {children}
    </Box>
  );
}
