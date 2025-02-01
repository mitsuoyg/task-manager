import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskType } from './Task';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineDelete } from 'react-icons/ai';

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

  useEffect(() => {
    if (column?.color) setColor(column.color);
  }, [column]);

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
            className="bg-white dark:bg-gray-800 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">
                Edit Column
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
              >
                <IoMdClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="space-y-2">
                <label className="block text-md font-medium text-gray-700 dark:text-gray-300">
                  Column Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-8 h-8 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Selected color: {color}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-300 dark:border-gray-700 my-2"></div>

              <button
                onClick={onDelete}
                disabled={hasTasksInColumn}
                className={`px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded disabled:opacity-50 flex items-center justify-end gap-2 ${
                  hasTasksInColumn ? '' : 'cursor-pointer'
                }`}
              >
                <AiOutlineDelete className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColumnModal;
