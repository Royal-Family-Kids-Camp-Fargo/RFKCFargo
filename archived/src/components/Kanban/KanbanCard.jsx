"use client";

import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function KanbanCard({ task, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <Accordion expanded={isOpen} onChange={() => setIsOpen(!isOpen)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className="flex justify-between items-center w-full">
                <h3 className="font-semibold">{task.content}</h3>
                <Button variant="text" size="small">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <p className="text-sm text-gray-600 mb-2">
                {task.first_name} {task.last_name}
              </p>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {task.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {task.phone}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Assigned to: {task.assigned_to}
                </p>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )}
    </Draggable>
  );
}
