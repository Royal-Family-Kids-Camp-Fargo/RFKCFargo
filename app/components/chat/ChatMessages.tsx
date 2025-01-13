import type { MutableRefObject } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessages as StyledChatMessages, MessageBubble, StatusMessage } from './styles';
import type { Message } from './types';

interface ChatMessagesProps {
  messages: Message[];
  statusMessage: string;
  messagesEndRef: MutableRefObject<HTMLDivElement | null>;
}

const ChatMessages: React.FunctionComponent<ChatMessagesProps> = ({ messages, statusMessage, messagesEndRef }) => {
  return (
    <StyledChatMessages>
      {messages.map((msg, index) => (
        <MessageBubble key={index} isSender={msg.speaker === 'human'}>
          <ReactMarkdown>{msg.content}</ReactMarkdown>
        </MessageBubble>
      ))}
      {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}
      <div ref={messagesEndRef} />
    </StyledChatMessages>
  );
};

export default ChatMessages; 