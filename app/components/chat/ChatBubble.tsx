import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { EventSourceParserStream } from 'eventsource-parser/stream';
import { useNavigation } from 'react-router';
import { getNavigationSuggestions } from '~/config/navigationConfig';
import useStore from '~/zustand/store';
import sendNlapiRequest from '~/api/nlapi';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Sparkles } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import NavigationSuggestions from './NavigationSuggestions';
import type { Message, Action } from './types';
import { authStore } from '~/stores/authStore.client';
import { botContextStore } from '~/stores/botContextStore';

export default function ChatBubble() {
  const navigate = useNavigation();
  const latestActions = useStore<Action[]>((state: any) => state.getActions());
  const setActions = useStore<(actions: Action[]) => void>(
    (state: any) => state.setActions
  );
  const botContext = botContextStore.getContext();

  const suggestions = useMemo(
    () => getNavigationSuggestions(latestActions),
    [latestActions]
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0 || statusMessage !== '') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, statusMessage]);

  const resetChat = () => {
    setMessages([]);
    setThreadId(null);
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const newMessage: Message = {
        content: message,
        speaker: 'human',
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');

      const sendMessage = async () => {
        const body = {
          userInput: message,
          threadId: threadId,
          context: botContext,
          options: {
            stream: true,
          },
        };

        try {
          const response = await handleSendingMessage(body);

          let thread_id;
          let latestActions;

          const reader = response.body
            ?.pipeThrough(new TextDecoderStream())
            ?.pipeThrough(new EventSourceParserStream());
          [thread_id, latestActions] = await handleStreamingEvents(reader);

          setThreadId(thread_id);
          if (latestActions) {
            setActions(latestActions);
          }
        } catch (error) {
          console.error('Error sending message to NLAPI:', error);
        }
      };

      sendMessage();
    },
    [message, threadId, setActions, botContext]
  );

  const handleSendingMessage = async (body: any) => {
    const auth = authStore.getAuth();
    const response = await sendNlapiRequest(
      auth?.access_token,
      body.userInput,
      body.context,
      body.threadId,
      body.options
    );
    if (!response.ok) {
      console.error('Response from NLAPI:', response);
      alert('Failed to send message');
    }
    return response;
  };

  const handleStreamingEvents = async (reader: any) => {
    let lastMessage = '';
    let lastChunkEvent = 'start';
    let threadId;

    const updateMessages = (content: string, isNewMessage: boolean) => {
      setMessages((prevMessages) => {
        const updatedMessages = isNewMessage
          ? [...prevMessages, { content, speaker: 'assistant' as const }]
          : [
              ...prevMessages.slice(0, -1),
              { content, speaker: 'assistant' as const },
            ];
        return updatedMessages;
      });
    };

    let latestActions;
    for await (const chunk of reader) {
      const { event, data } = chunk;
      const chunkEventData = JSON.parse(data);

      if (event === 'status_message') {
        setStatusMessage(chunkEventData.content);
      } else {
        setStatusMessage('');
      }

      if (event === 'message_chunk') {
        lastMessage += chunkEventData.content;
        updateMessages(lastMessage, lastChunkEvent !== 'message_chunk');
      } else if (event === 'close') {
        threadId = chunkEventData.thread_id;
        const actions_called = chunkEventData.actions_called;
        if (actions_called) {
          latestActions = actions_called.map((action: Action) => ({
            path: action.path,
            method: action.method,
            response: action.response,
          }));
        }
      } else if (event === 'error') {
        console.error('Error from NLAPI:', chunkEventData);
      }

      lastChunkEvent = event;
    }

    return [threadId, latestActions];
  };

  return (
    <>
      {!isExpanded && (
        <Button
          className="fixed bottom-6 right-8 h-16 w-16 rounded-full p-0 hover:bg-chat-bubble-hover shadow-lg"
          onClick={() => setIsExpanded(true)}
        >
          <Sparkles className="scale-175" />
        </Button>
      )}

      {isExpanded && (
        <Card className="fixed bottom-4 right-4 flex w-[90%] max-w-[480px] flex-col overflow-hidden sm:h-[60vh] h-[80vh] shadow-lg">
          <ChatHeader resetChat={resetChat} setIsExpanded={setIsExpanded} />
          <ChatMessages
            messages={messages}
            statusMessage={statusMessage}
            messagesEndRef={messagesEndRef}
          />
          <ChatInput
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmit}
          />
          <NavigationSuggestions suggestions={suggestions} />
        </Card>
      )}
    </>
  );
}
