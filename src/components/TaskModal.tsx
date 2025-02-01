import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  const initialValues = {
    id: '',
    title: '',
    description: '',
    dueDate: '',
    columnId: '',
  };
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Task>(task || initialValues);
  const [touched, setTouched] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isValid = useMemo(() => {
    return formData.title?.trim().length > 0;
  }, [formData.title]);

  useEffect(() => {
    if (task) setFormData(task);
  }, [task]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && task && !task?.id) {
      setTouched(false);
      setFormData({ ...initialValues, columnId: task.columnId });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setTouched(true);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
    setTouched(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (task) {
      deleteTask(task.id, task.columnId);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <AnimatePresence mode="wait">
            {showDeleteConfirm ? (
              <motion.div
                key="delete-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4 dark:text-white">
                  Delete Task?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Are you sure you want to delete this task? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="task-modal"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                  <h2 className="text-xl font-semibold dark:text-white">
                    {task?.id ? 'Edit Task' : 'New Task'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
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
                      ref={titleInputRef}
                      required
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Enter task title"
                      className={`w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white ${
                        touched && !isValid
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                          : ''
                      }`}
                    />
                    {touched && !isValid && (
                      <p className="text-red-500 text-sm mt-1">
                        Title is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Add task details"
                      rows={3}
                      className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
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
                        className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
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
                        className="w-full p-2 rounded-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
                      >
                        {columns.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-700">
                    {task?.id && (
                      <button
                        type="button"
                        onClick={handleDeleteClick}
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
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
