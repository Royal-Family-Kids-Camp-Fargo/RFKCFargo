import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { styled } from "@mui/material/styles";
import {
  Fab,
  Paper,
  TextField,
  IconButton,
  Typography,
  Grow,
  Button,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { useNavigation } from "react-router";
import { getNavigationSuggestions } from "~/config/navigationConfig";
import useStore from "~/zustand/store";
import sendNlapiRequest from "~/api/nlapi";
import ChatHeader from "./ChatHeader";
import { shallow } from "zustand/shallow";

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: "90%", // Default width for smaller screens
  height: "60vh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

const ChatMessages = styled("div")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: "auto",
  fontSize: "1.2rem",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const MessageBubble = styled("div")(({ theme, isSender }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: isSender
    ? theme.palette.primary.main
    : theme.palette.grey[300],
  color: isSender
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  alignSelf: isSender ? "flex-end" : "flex-start",
}));

const ChatInput = styled("form")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StatusMessage = styled("div")(({ theme }) => ({
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

const NavigationSuggestions = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const SuggestionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function ChatBubble() {
  const navigate = useNavigation();
  const latestActions = useStore((state) => state.getActions());
  const setActions = useStore((state) => state.setActions);
  const botContext = useStore((state) => state.context);

  const suggestions = useMemo(
    () => getNavigationSuggestions(latestActions),
    [latestActions]
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("useEffect triggered: messages or statusMessage changed");
    console.log("Current messages:", messages);
    console.log("Current statusMessage:", statusMessage);

    if (messages.length > 0 || statusMessage !== "") {
      console.log("Scrolling into view...");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("No messages or statusMessage to scroll");
    }
  }, [messages, statusMessage]);

  // useEffect(() => {
  //   console.log("latestActions changed:", latestActions);
  // }, [latestActions]);

  const resetChat = () => {
    setMessages([]);
    setThreadId(null);
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log("Form submitted with message:", message);

      const newMessage = {
        content: message,
        speaker: "human",
      };
      setMessages((prevMessages) => {
        console.log("Updating messages state with new message:", newMessage);
        return [...prevMessages, newMessage];
      });
      setMessage("");

      const sendMessage = async () => {
        let body = {
          userInput: message,
          threadId: threadId,
          context: botContext,
          options: {
            stream: isStreaming,
          },
        };
        console.log("Sending message with body:", body);

        try {
          const response = await handleSendingMessage(body);
          console.log("Response received:", response);

          let thread_id;
          let latestActions;
          if (isStreaming) {
            const reader = response.body
              ?.pipeThrough(new TextDecoderStream())
              ?.pipeThrough(new EventSourceParserStream());
            [thread_id, latestActions] = await handleStreamingEvents(reader);
          } else {
            const data = await response.json();
            console.log("Non-Streaming Response from NLAPI:", data);
            setMessages(data.messages.reverse());
            thread_id = data.thread_id;
            const actions_called = data.actions_called;
            if (actions_called) {
              latestActions = actions_called.map((action) => ({
                path: action["path"],
                method: action["method"],
                response: action["response"],
              }));
            }
          }
          setThreadId(thread_id);
          if (latestActions) {
            console.log("latestActions", latestActions);
            setActions(latestActions);
          }
        } catch (error) {
          console.error("Error sending message to NLAPI:", error);
        }
      };

      sendMessage();
    },
    [message, isStreaming, threadId, setActions, botContext]
  );

  const handleSendingMessage = async (body) => {
    console.log("handleSendingMessage called with body:", body);
    const authToken = localStorage.getItem("accessToken");
    const response = await sendNlapiRequest(
      authToken,
      body.userInput,
      body.context,
      body.threadId,
      body.options
    );
    if (!response.ok) {
      console.error("Response from NLAPI:", response);
      alert("Failed to send message");
    }
    return response;
  };

  const handleStreamingEvents = async (reader) => {
    console.log("handleStreamingEvents called");
    let lastMessage = "";
    let lastChunkEvent = "start";
    let threadId;

    const updateMessages = (content, isNewMessage) => {
      console.log("updateMessages called with content:", content);
      setMessages((prevMessages) => {
        const updatedMessages = isNewMessage
          ? [...prevMessages, { content, speaker: "assistant" }]
          : [...prevMessages.slice(0, -1), { content, speaker: "assistant" }];
        return updatedMessages;
      });
    };

    let latestActions;
    for await (const chunk of reader) {
      const { event, data } = chunk;
      const chunkEventData = JSON.parse(data);
      console.log("Chunk Event Data:", chunkEventData);

      if (event === "status_message") {
        setStatusMessage(chunkEventData.content);
      } else {
        setStatusMessage("");
      }

      if (event === "message_chunk") {
        lastMessage += chunkEventData.content;
        updateMessages(lastMessage, lastChunkEvent !== "message_chunk");
      } else if (event === "close") {
        threadId = chunkEventData.thread_id;
        const actions_called = chunkEventData.actions_called;
        if (actions_called) {
          latestActions = actions_called.map((action) => ({
            path: action["path"],
            method: action["method"],
            response: action["response"],
          }));
        }
      } else if (event === "error") {
        console.error("Error from NLAPI:", chunkEventData);
      }

      lastChunkEvent = event;
    }

    return [threadId, latestActions];
  };

  return (
    <>
      <Grow in={!isExpanded}>
        <Fab
          color="primary"
          aria-label="chat"
          style={{
            position: "fixed",
            bottom: 36,
            right: 36,
            height: 80,
            width: 80,
          }}
          onClick={() => setIsExpanded(true)}
        >
          <ChatIcon />
        </Fab>
      </Grow>

      <Grow in={isExpanded} style={{ transformOrigin: "0 0 0" }}>
        <ChatContainer>
          <ChatHeader
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
            resetChat={resetChat}
            setIsExpanded={setIsExpanded}
          />
          <ChatMessages>
            {messages.map((msg, index) => (
              <MessageBubble key={index} isSender={msg.speaker === "human"}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </MessageBubble>
            ))}
            {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInput onSubmit={handleSubmit}>
            <TextField
              label="Type your message"
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              margin="normal"
            />
            <IconButton type="submit" color="primary">
              <SendIcon />
            </IconButton>
          </ChatInput>
          <Grow in={suggestions.length > 0}>
            <NavigationSuggestions>
              {suggestions.map((suggestion, index) => (
                <SuggestionButton
                  key={index}
                  variant="contained"
                  onClick={() => {
                    navigate(suggestion.route);
                  }}
                >
                  {suggestion.description}
                </SuggestionButton>
              ))}
            </NavigationSuggestions>
          </Grow>
        </ChatContainer>
      </Grow>
    </>
  );
}