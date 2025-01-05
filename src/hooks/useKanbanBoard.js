import { useState, useMemo } from "react";

export function useKanbanBoard() {
  const [board, setBoard] = useState(initialState);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAssigned, setFilterAssigned] = useState("");

  const filteredBoard = useMemo(() => {
    const filtered = {};
    Object.entries(board).forEach(([columnId, column]) => {
      filtered[columnId] = {
        ...column,
        tasks: column.tasks.filter((task) => {
          const matchesSearch =
            task.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.last_name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter =
            filterAssigned === "all" || task.assigned_to === filterAssigned;
          return matchesSearch && matchesFilter;
        }),
      };
    });
    return filtered;
  }, [board, searchTerm, filterAssigned]);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const column = board[source.droppableId];
      const newTasks = Array.from(column.tasks);
      const [reorderedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedTask);

      setBoard({
        ...board,
        [source.droppableId]: {
          ...column,
          tasks: newTasks,
        },
      });
    } else {
      const sourceColumn = board[source.droppableId];
      const destColumn = board[destination.droppableId];
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks = Array.from(destColumn.tasks);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);

      setBoard({
        ...board,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks,
        },
      });
    }
  };

  return {
    board: filteredBoard,
    onDragEnd,
    searchTerm,
    setSearchTerm,
    filterAssigned,
    setFilterAssigned,
  };
}
