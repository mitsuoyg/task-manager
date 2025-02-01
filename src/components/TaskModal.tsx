import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose, IoMdCalendar } from 'react-icons/io';
import { AiOutlineTag, AiOutlineDelete } from 'react-icons/ai';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  columnId: string;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
  color: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmit: (task: Task) => void;
  columns: Column[];
  deleteTask: (taskId: string, columnId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSubmit,
  columns,
  deleteTask,
}) => {
  const [formData, setFormData] = useState<Task>(
    task || { id: '', title: '', description: '', dueDate: '', columnId: '' }
  );
  const [touched, setTouched] = useState(false);

  // Validate form data
  const isValid = useMemo(() => {
    return formData.title?.trim().length > 0;
  }, [formData.title]);

  useEffect(() => {
    if (task) setFormData(task);
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setTouched(true);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      dueDate: '',
      columnId: '',
    });
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
    setTouched(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">
                {task?.id ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <IoMdClose className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter task title"
                  className={`w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    touched && !isValid
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                />
                {touched && !isValid && (
                  <p className="text-red-500 text-sm mt-1">Title is required</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add task details"
                  rows={3}
                  className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <IoMdCalendar className="w-4 h-4" />
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <AiOutlineTag className="w-4 h-4" />
                    Status
                  </label>
                  <select
                    value={formData.columnId}
                    onChange={(e) =>
                      setFormData({ ...formData, columnId: e.target.value })
                    }
                    className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {columns.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                {task?.id && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this task?')) {
                        deleteTask(task.id, task.columnId);
                        onClose();
                      }
                    }}
                    disabled={!isValid}
                    className={`px-4 py-2 flex items-center gap-2 text-red-500 rounded-md transition-colors ${
                      isValid
                        ? 'hover:bg-red-50 dark:hover:bg-gray-700 cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <AiOutlineDelete className="w-4 h-4" />
                    Delete
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors flex items-center gap-2 ${
                    isValid
                      ? 'hover:bg-blue-600 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
