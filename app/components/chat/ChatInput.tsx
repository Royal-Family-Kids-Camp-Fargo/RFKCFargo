import { Button } from '~/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useEffect, useState } from 'react';

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
  const [lineCount, setLineCount] = useState(1);
  const MAX_LINES = 5;

  const adjustLineCount = () => {
    const lineCount = Math.min(
      (message.match(/\n/g) || []).length + 1,
      MAX_LINES
    );
    setLineCount(lineCount);
  };

  useEffect(() => {
    adjustLineCount();
  }, [message]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 border-t p-4">
      <Textarea
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 resize-none min-h-[40px] max-h-[120px] text-sm"
        rows={lineCount}
      />
      <Button variant="ghost" type="submit" size="icon">
        <ArrowUp className="scale-150" />
      </Button>
    </form>
  );
};

export default ChatInput;
