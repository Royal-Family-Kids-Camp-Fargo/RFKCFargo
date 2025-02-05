import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ArrowUp, Send } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useEffect, useRef } from 'react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 5 * 24); // Assuming line height is ~24px
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
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
        ref={textareaRef}
        placeholder="Type your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 resize-none min-h-[40px] max-h-[120px]"
        rows={1}
      />
      <Button variant="ghost" type="submit" size="icon">
        <ArrowUp className="scale-150" />
      </Button>
    </form>
  );
};

export default ChatInput;
