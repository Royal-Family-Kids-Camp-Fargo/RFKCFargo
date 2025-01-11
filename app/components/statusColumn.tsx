import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import UserCard from "./userCard";
import type { User } from "~/api/objects/user";

/**
 * Each status column.
 */
export default function StatusColumn({
  status,
  globalSearchTerm,
}: {
  status: any;
  globalSearchTerm: string;
}) {
  const theme = useTheme();

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!status.user_collection || !Array.isArray(status.user_collection)) {
      return [];
    }
    if (!globalSearchTerm) return status.user_collection;

    const term = globalSearchTerm.toLowerCase();
    return status.user_collection.filter((user: User) => {
      return (
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    });
  }, [status.user_collection, globalSearchTerm]);

  return (
    <Box
      sx={{
        minWidth: { xs: "85vw", sm: "350px" },
        maxWidth: { xs: "85vw", sm: "350px" },
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #dee2e6",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#4b0082",
          borderBottom: "2px solid #20c997",
          pb: 1,
          mb: 2,
          fontSize: { xs: "1rem", sm: "1.25rem" },
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: "bold",
        }}
      >
        {status.name}
      </Typography>
      {filteredUsers.map((user: User) => (
        <UserCard key={user.id} user={user} />
      ))}
    </Box>
  );
}
