import { Button } from '~/components/ui/button';
import { CardHeader } from '~/components/ui/card';
import { Minus, MessageSquarePlus, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '~/components/ui/tooltip';

type ChatHeaderProps = {
  resetChat: () => void;
  setIsExpanded: (isExpanded: boolean) => void;
};

export default function ChatHeader({
  resetChat,
  setIsExpanded,
}: ChatHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center gap2 justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Sparkles />
        <h2 className="text-lg font-semibold">RFK Assistant</h2>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={resetChat}>
                <MessageSquarePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start new chat thread</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(false)}
        >
          <Minus />
        </Button>
      </div>
    </CardHeader>
  );
}
