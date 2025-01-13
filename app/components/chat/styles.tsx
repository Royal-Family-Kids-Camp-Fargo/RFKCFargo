import { styled } from "@mui/material/styles";
import { Paper, Button } from "@mui/material";

export const ChatContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: "90%",
  height: "60vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

export const ChatMessages = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  fontSize: "1.2rem",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

interface MessageBubbleProps {
  isSender: boolean;
}

export const MessageBubble = styled("div")<MessageBubbleProps>(({ theme, isSender }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: isSender ? theme.palette.primary.main : theme.palette.grey[300],
  color: isSender ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isSender ? "flex-end" : "flex-start",
}));

export const ChatInput = styled("form")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const StatusMessage = styled("div")(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  alignSelf: "left",
  fontStyle: "italic",
  "&::after": {
    content: '"..."',
    animation: "ellipsis 1s infinite",
  },
  "@keyframes ellipsis": {
    "0%": { content: '"."' },
    "33%": { content: '".."' },
    "66%": { content: '"..."' },
    "100%": { content: '"."' },
  },
}));

export const NavigationSuggestions = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const SuggestionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
})); 