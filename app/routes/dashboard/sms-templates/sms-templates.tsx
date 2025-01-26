import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import smsTemplateApi from '~/api/objects/sms_template';
import type { SmsTemplate } from '~/api/objects/sms_template';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import TemplateList from './components/TemplateList';
import TemplateForm from './components/TemplateForm';
import { authStore } from '~/stores/authStore';

const SmsTemplatesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);

  const { data: templates, error, isLoading } = useQuery({
    queryKey: ['smsTemplates'],
    queryFn: async () => {
      console.log("querying getAll sms templates");
      const res = await smsTemplateApi.getAll();
      if (res instanceof Error) {
        throw res;
      }
      return res.data as unknown as SmsTemplate[];
    },
  });

  const addTemplateMutation = useMutation({
    mutationFn: (newTemplate: Omit<SmsTemplate, 'id' | 'user_id'>) => {
      const user = authStore.getUser();
      if (!user) throw new Error('User not authenticated');
      return smsTemplateApi.create({ ...newTemplate, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsTemplates'] });
      setIsFormOpen(false);
    },
    onError: () => {
      alert('Failed to add SMS template');
    },
  });

  const editTemplateMutation = useMutation({
    mutationFn: ({ id, updatedTemplate }: { id: string; updatedTemplate: Partial<SmsTemplate> }) => {
      const user = authStore.getUser();
      if (!user) throw new Error('User not authenticated');
      return smsTemplateApi.update(id, { ...updatedTemplate, user_id: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsTemplates'] });
      setEditingTemplate(null);
      setIsFormOpen(false);
    },
    onError: () => {
      alert('Failed to update SMS template');
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => smsTemplateApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['smsTemplates'] });
    },
    onError: () => {
      alert('Failed to delete SMS template');
    },
  });

  const handleAddTemplate = (newTemplate: Omit<SmsTemplate, 'id' | 'user_id'>) => {
    addTemplateMutation.mutate(newTemplate);
  };

  const handleEditTemplate = (id: string, updatedTemplate: Partial<SmsTemplate>) => {
    editTemplateMutation.mutate({ id, updatedTemplate });
  };

  const handleDeleteTemplate = (id: string) => {
    deleteTemplateMutation.mutate(id);
  };

  const handleOpenEdit = (template: SmsTemplate) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600 p-4">Failed to fetch SMS templates</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SMS Templates</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsFormOpen(true)}
        >
          Add Template
        </Button>
      </div>

      <TemplateList
        templates={templates || []}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteTemplate}
      />

      <Dialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTemplate(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingTemplate ? 'Edit Template' : 'Add New Template'}
        </DialogTitle>
        <DialogContent>
          <TemplateForm
            initialData={editingTemplate}
            onSubmit={editingTemplate 
              ? (data) => handleEditTemplate(editingTemplate.id, data)
              : handleAddTemplate
            }
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTemplate(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmsTemplatesPage;
