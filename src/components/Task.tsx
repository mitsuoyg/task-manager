import React from 'react';
import { motion } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';

export interface TaskType {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  columnId: string;
}

interface TaskProps {
  task: TaskType;
  index: number;
  onTaskClick: (task: TaskType) => void;
}

const Task: React.FC<TaskProps> = ({ task, index, onTaskClick }) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onTaskClick(task)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <h3 className="font-medium dark:text-white">{task.title}</h3>
            {task.dueDate && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
