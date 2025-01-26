import React from 'react';
import type { SmsTemplate } from '~/api/objects/sms_template';
import { useForm } from 'react-hook-form';
import { 
  TextField, 
  Button, 
  FormControlLabel, 
  Checkbox,
  Stack
} from '@mui/material';

type TemplateFormData = Omit<SmsTemplate, 'id' | 'user_id'>;

interface TemplateFormProps {
  initialData?: SmsTemplate | null;
  onSubmit: (data: TemplateFormData) => void;
  onCancel: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TemplateFormData>({
    defaultValues: initialData || {
      title: '',
      template: '',
      is_shared: false,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <Stack spacing={3}>
        <TextField
          label="Title"
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />

        <TextField
          label="Template"
          fullWidth
          multiline
          rows={4}
          error={!!errors.template}
          helperText={errors.template?.message}
          {...register('template', { required: 'Template content is required' })}
        />

        <FormControlLabel
          control={
            <Checkbox
              {...register('is_shared')}
              defaultChecked={initialData?.is_shared}
            />
          }
          label="Share this template with other users"
        />

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? 'Update' : 'Create'} Template
          </Button>
        </div>
      </Stack>
    </form>
  );
};

export default TemplateForm; 