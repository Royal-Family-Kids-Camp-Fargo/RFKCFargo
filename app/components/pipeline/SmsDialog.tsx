import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem } from '@mui/material';
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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
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

  const handleTemplateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const templateId = event.target.value;
    setSelectedTemplateId(templateId);
    const selectedTemplate = templates?.find(template => template.id === templateId);
    setMessage(replaceTemplateVariables(selectedTemplate?.template || '', user));
  };

  const replaceTemplateVariables = (template: string, data: Record<string, any>) => {
    console.log("template", template);
    console.log("data", data);
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (match, key) => {
        console.log("match", match);
        console.log("key", key);
      return data[key] || '';
    });
  };

  const handleSend = () => {
    
    const smsUrl = `sms:${user.phone_number}?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Select SMS Template</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Template"
          fullWidth
          value={selectedTemplateId || ''}
          onChange={handleTemplateChange}
          disabled={isLoading}
          margin="normal"
        >
          {templates?.map(template => (
            <MenuItem key={template.id} value={template.id}>
              {template.title}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SmsDialog; 