import React from "react";
import { Typography, Button, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

type ChatHeaderProps = {
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  resetChat: () => void;
  setIsExpanded: (isExpanded: boolean) => void;
};

const ChatHeaderDiv = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export default function ChatHeader({
  isStreaming,
  setIsStreaming,
  resetChat,
  setIsExpanded,
}: ChatHeaderProps) {
  return (
    <ChatHeaderDiv>
      <Typography variant="h6">Chat</Typography>
      <Button
        variant="contained"
        color={isStreaming ? "success" : "primary"}
        onClick={() => setIsStreaming(!isStreaming)}
      >
        {isStreaming ? "Stream On" : "Stream Off"}
      </Button>
      <IconButton
        color="inherit"
        onClick={() => {
          resetChat();
        }}
      >
        <RefreshIcon />
      </IconButton>
      <IconButton color="inherit" onClick={() => setIsExpanded(false)}>
        <CloseIcon />
      </IconButton>
    </ChatHeaderDiv>
  );
}
