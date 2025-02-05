import React from 'react';
import { Button } from '~/components/ui/button';
import { CardHeader } from '~/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { Switch } from '~/components/ui/switch';
import { Label } from '~/components/ui/label';

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
    <CardHeader className="flex flex-row items-center justify-between bg-muted p-4 text-muted-foreground">
      <h2 className="text-lg font-semibold">Chat</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="streaming-mode"
            checked={isStreaming}
            onCheckedChange={setIsStreaming}
            defaultChecked
          />
          <Label htmlFor="streaming-mode" className="text-sm">
            {isStreaming ? 'Stream On' : 'Stream Off'}
          </Label>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-muted-foreground/90"
          onClick={resetChat}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-muted-foreground/90"
          onClick={() => setIsExpanded(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </CardHeader>
  );
}
