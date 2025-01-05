import { Droppable } from 'react-beautiful-dnd';
import KanbanCard from './KanbanCard';



export default function KanbanColumn({ column }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80 flex-shrink-0">
      <h2 className="font-bold mb-4">{column.name}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[200px]"
          >
            {column.user_collection.map((user, index) => (
              <KanbanCard key={user.id} user={user} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

