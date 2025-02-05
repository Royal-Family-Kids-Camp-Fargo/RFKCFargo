import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  message,
  setMessage,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 border-t p-4">
      <Input
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
