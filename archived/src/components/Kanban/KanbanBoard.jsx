'use client'

import { DragDropContext } from 'react-beautiful-dnd';
import { useKanbanBoard } from '../../hooks/useKanbanBoard';
import KanbanColumn from './KanbanColumn';
import KanbanControls from './KanbanControls';

export default function KanbanBoard(props) {
  const { board, onDragEnd, searchTerm, setSearchTerm, filterAssigned, setFilterAssigned } = useKanbanBoard();

  const assignedOptions = Array.from(
    new Set(
      Object.values(board)
        .flatMap((column) => column.user_collection)
        .map((user) => user.user.first_name)
    )
  );

  return (
    <div className="flex flex-col h-full">
      <KanbanControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterAssigned={filterAssigned}
        setFilterAssigned={setFilterAssigned}
        assignedOptions={assignedOptions}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4 h-full overflow-x-auto">
          {Object.values(board).map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

