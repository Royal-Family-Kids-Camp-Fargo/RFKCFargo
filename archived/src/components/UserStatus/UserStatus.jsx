import { useState } from "react";
import { useDrag } from "react-dnd";
import useStore from "../../zustand/store";
import { useNavigate } from "react-router-dom";
import { DRAG_TYPE } from "../Pipeline/Pipeline";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Collapse,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

export default function UserStatus({ person }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: person,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleClick = () => {
    navigate(`/user/${person.id}`);
  };

  const iconSize = isMobile ? 16 : 20;

  return (
    <Card
      ref={drag}
      elevation={isDragging ? 4 : 1}
      sx={{
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        "&:hover": {
          boxShadow: 3,
        },
        transition: "all 0.2s ease",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 0.5, sm: 1 },
          "&:last-child": { pb: { xs: 0.5, sm: 1 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flex: 1,
              minWidth: 0,
            }}
          >
            <PersonIcon color="action" sx={{ fontSize: iconSize }} />
            <Typography
              variant="body2"
              noWrap
              onClick={handleClick}
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
                fontWeight: "medium",
                fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              }}
            >
              {person.first_name} {person.last_name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            sx={{
              ml: 0.5,
              p: { xs: 0.25, sm: 0.5 },
            }}
          >
            {isExpanded ? (
              <ExpandLessIcon sx={{ fontSize: iconSize }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: iconSize }} />
            )}
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Box
            sx={{ mt: 0.5, display: "flex", flexDirection: "column", gap: 0.5 }}
          >
            {person.email && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <EmailIcon color="action" sx={{ fontSize: iconSize }} />
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {person.email}
                </Typography>
              </Box>
            )}
            {person.phone_number && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <PhoneIcon color="action" sx={{ fontSize: iconSize }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {person.phone_number}
                </Typography>
              </Box>
            )}
            {person.user?.first_name && (
              <>
                <Divider sx={{ my: 0.25 }} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AssignmentIcon color="action" sx={{ fontSize: iconSize }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                  >
                    Assigned to: {person.user.first_name}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
