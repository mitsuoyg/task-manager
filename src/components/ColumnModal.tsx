import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskType } from './Task';

interface Column {
  id: string;
  name: string;
  tasks: TaskType[];
  color: string;
}

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: Column | null;
  onDelete: () => void;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}

const ColumnModal: React.FC<ColumnModalProps> = ({
  isOpen,
  onClose,
  column,
  onDelete,
  setColumns,
}) => {
  const [color, setColor] = useState<string>(column?.color || '#6b7280');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setColumns((cols) =>
      cols.map((col) =>
        col.id === column!.id ? { ...col, color: e.target.value } : col
      )
    );
  };

  const hasTasksInColumn = (column?.tasks?.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-3">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Column Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-12 h-12 cursor-pointer rounded border dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Selected color: {color}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 my-2"></div>

              <button
                onClick={onDelete}
                disabled={hasTasksInColumn}
                className={`px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded disabled:opacity-50 flex items-center justify-center gap-2 ${
                  hasTasksInColumn ? '' : 'cursor-pointer'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete Column
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColumnModal;
