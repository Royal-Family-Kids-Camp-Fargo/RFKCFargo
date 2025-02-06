import { Button } from '~/components/ui/button';
import { CardHeader } from '~/components/ui/card';
import { X, MessageSquarePlus, Sparkles } from 'lucide-react';
import { Switch } from '~/components/ui/switch';
import { Label } from '~/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '~/components/ui/tooltip';

type ChatHeaderProps = {
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
  resetChat: () => void;
  setIsExpanded: (isExpanded: boolean) => void;
};

export default function ChatHeader({
  isStreaming,
  setIsStreaming,
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
        <div className="flex items-center gap-2">
          <Label
            htmlFor="streaming-mode"
            className="text-sm text-muted-foreground"
          >
            {isStreaming ? 'Stream On' : 'Stream Off'}
          </Label>
          <Switch
            id="streaming-mode"
            checked={isStreaming}
            onCheckedChange={setIsStreaming}
            defaultChecked
          />
        </div>
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
          <X />
        </Button>
      </div>
    </CardHeader>
  );
}
