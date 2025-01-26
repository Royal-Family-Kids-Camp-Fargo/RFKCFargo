import React from 'react';
import type { SmsTemplate } from '~/api/objects/sms_template';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TemplateListProps {
  templates: SmsTemplate[];
  onEdit: (template: SmsTemplate) => void;
  onDelete: (id: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ templates, onEdit, onDelete }) => {
  console.log("rendering TemplateList", templates);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Shared</TableCell>
            <TableCell width={120}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.title}</TableCell>
              <TableCell>{template.template}</TableCell>
              <TableCell>{template.is_shared ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(template)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(template.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {templates.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No templates found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateList; 