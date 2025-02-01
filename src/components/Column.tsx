import React from 'react';
import { motion } from 'framer-motion';
import { Droppable } from '@hello-pangea/dnd';
import Task, { TaskType } from './Task';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';

export interface ColumnType {
  id: string;
  name: string;
  tasks: TaskType[];
  color: string;
}

interface ColumnProps {
  column: ColumnType;
  onTaskClick: (task: TaskType | { columnId: string }) => void;
  onColumnClick: (column: ColumnType) => void;
  onColumnNameChange: (columnId: string, newName: string) => void; // Add this line
}

const Column: React.FC<ColumnProps> = ({
  column,
  onTaskClick,
  onColumnClick,
  onColumnNameChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-w-[300px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
    >
      <div className="flex justify-between items-center mb-4">
        <input
          value={column.name}
          onChange={(e) => {
            onColumnNameChange(column.id, e.target.value);
          }}
          className="font-bold text-lg bg-transparent dark:text-white"
          style={{ borderBottom: `3px solid ${column.color}` }}
        />
        <button
          onClick={() => onColumnClick(column)}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
        >
          <FaEllipsisV size={14} />
        </button>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2 min-h-[100px]"
          >
            {column.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                onTaskClick={onTaskClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={() => onTaskClick({ columnId: column.id })}
        className="w-full mt-4 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer flex items-center justify-center"
      >
        <FaPlus size={12} />
        <span className="ml-2">Add Task</span>
      </button>
    </motion.div>
  );
};

export default Column;
