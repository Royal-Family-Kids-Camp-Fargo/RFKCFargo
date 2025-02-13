import type { RefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '~/lib/utils';
import type { Message } from './types';

interface ChatMessagesProps {
  messages: Message[];
  statusMessage: string;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  statusMessage,
  messagesEndRef,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 text-sm">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            'max-w-[70%] rounded-lg p-3',
            msg.speaker === 'human'
              ? 'ml-auto bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </div>
      ))}
      {statusMessage && (
        <div className="self-start p-2 text-muted-foreground italic">
          {statusMessage}
          <span className="animate-[ellipsis_1s_infinite]">...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
