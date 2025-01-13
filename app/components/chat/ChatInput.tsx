import { TextField, IconButton } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { ChatInput as StyledChatInput } from './styles';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FunctionComponent<ChatInputProps> = ({ message, setMessage, onSubmit }) => {
  return (
    <StyledChatInput onSubmit={onSubmit}>
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
    </StyledChatInput>
  );
};

export default ChatInput; 