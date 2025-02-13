import React from 'react';
import type { SmsTemplate } from '~/api/objects/sms_template';
import { useForm } from 'react-hook-form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';
import { cn } from '~/lib/utils';

type TemplateFormData = Omit<SmsTemplate, 'id' | 'user_id'>;

interface TemplateFormProps {
  initialData?: SmsTemplate | null;
  onSubmit: (data: TemplateFormData) => void;
  onCancel: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormData>({
    defaultValues: initialData || {
      title: '',
      template: '',
      is_shared: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          className={cn(errors.title && 'border-destructive')}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">Template</Label>
        <Textarea
          id="template"
          {...register('template', {
            required: 'Template content is required',
          })}
          className={cn(errors.template && 'border-destructive')}
          rows={4}
        />
        {errors.template && (
          <p className="text-sm text-destructive">{errors.template.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_shared"
          {...register('is_shared')}
          defaultChecked={initialData?.is_shared}
        />
        <Label htmlFor="is_shared" className="text-sm font-normal">
          Share this template with other users
        </Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Template
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;
