import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import smsTemplateApi from '~/api/objects/sms_template';
import type { SmsTemplate } from '~/api/objects/sms_template';
import type { User } from '~/api/objects/user';

interface SmsDialogProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const SmsDialog: React.FC<SmsDialogProps> = ({ open, onClose, user }) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState<string>('');

  const { data: templates, isLoading } = useQuery({
    queryKey: ['smsTemplates'],
    queryFn: async () => {
      const res = await smsTemplateApi.getAll();
      if (res instanceof Error) {
        throw res;
      }
      return res.data as SmsTemplate[];
    },
  });

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates?.find(
      (template) => template.id === templateId
    );
    setMessage(
      replaceTemplateVariables(selectedTemplate?.template || '', user)
    );
  };

  const replaceTemplateVariables = (
    template: string,
    data: Record<string, any>
  ) => {
    console.log('template', template);
    console.log('data', data);
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
      console.log('match', match);
      console.log('key', key);
      return data[key] || '';
    });
  };

  const handleSend = () => {
    const smsUrl = `sms:${user.phone_number}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select SMS Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            disabled={isLoading}
            value={selectedTemplateId || ''}
            onValueChange={handleTemplateChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            className="min-h-[100px]"
          />

          <Button onClick={handleSend} className="w-full">
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmsDialog;
