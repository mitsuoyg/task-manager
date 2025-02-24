import { useState, useEffect, useRef } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import {
  FaSun,
  FaMoon,
  FaFileExport,
  FaFileImport,
  FaPlus,
  FaBars,
  FaGithub,
} from 'react-icons/fa';

import { TaskType } from './Task';
import Column, { ColumnType } from './Column';
import TaskModal from './TaskModal';
import ColumnModal from './ColumnModal';
import logo from '../assets/logo.png';

const initialColumns = [
  {
    id: 'todo',
    name: 'Todo',
    tasks: [
      {
        id: uuidv4(),
        title: '🚀 Welcome to Task Manager!',
        description: '',
        columnId: 'todo',
      },
    ],
    color: '#3b82f6',
  },
  { id: 'inProgress', name: 'In Progress', tasks: [], color: '#f59e0b' },
  { id: 'done', name: 'Done', tasks: [], color: '#10b981' },
];

const TaskManager = () => {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const saved = localStorage.getItem('task-manager');
    return saved ? JSON.parse(saved).columns : initialColumns;
  });
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') || 'dark'
  );
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<ColumnType | null>(null);
  const [showNewColumnInput, setShowNewColumnInput] = useState<boolean>(false);
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [boardTitle, setBoardTitle] = useState<string>(() => {
    const saved = localStorage.getItem('task-manager');
    return saved ? JSON.parse(saved).boardTitle : 'My Task Board';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'task-manager',
      JSON.stringify({ columns, boardTitle })
    );
  }, [columns, boardTitle]);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns.find((col) => col.id === source.droppableId);
    const destCol = columns.find((col) => col.id === destination.droppableId);
    const task = sourceCol?.tasks[source.index];

    if (!sourceCol || !destCol || !task) return;

    if (source.droppableId === destination.droppableId) {
      const newTasks = [...sourceCol.tasks];
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, task);

      setColumns((cols) =>
        cols.map((col) =>
          col.id === sourceCol.id ? { ...col, tasks: newTasks } : col
        )
      );
    } else {
      const sourceTasks = [...sourceCol.tasks];
      const destTasks = [...destCol.tasks];
      sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, { ...task, columnId: destCol.id });

      setColumns((cols) =>
        cols.map((col) => {
          if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks };
          if (col.id === destCol.id) return { ...col, tasks: destTasks };
          return col;
        })
      );
    }
  };

  const handleTaskSubmit = (taskData: TaskType) => {
    if (taskData.id) {
      setColumns((cols) => {
        const updatedCols = cols.map((col) => {
          if (col.id === taskData.columnId) {
            return {
              ...col,
              tasks: col.tasks.map((t) =>
                t.id === taskData.id ? { ...t, ...taskData } : t
              ),
            };
          } else {
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== taskData.id),
            };
          }
        });

        const targetCol = updatedCols.find(
          (col) => col.id === taskData.columnId
        );
        if (targetCol && !targetCol.tasks.some((t) => t.id === taskData.id)) {
          targetCol.tasks.push(taskData);
        }

        return updatedCols;
      });
    } else {
      const newTask = {
        ...taskData,
        id: uuidv4(),
        columnId: taskData.columnId,
      };
      setColumns((cols) =>
        cols.map((col) =>
          col.id === taskData.columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        )
      );
    }
  };

  const handleColumnSubmit = () => {
    if (newColumnName.trim()) {
      const newColumn: ColumnType = {
        id: uuidv4(),
        name: newColumnName,
        tasks: [],
        color: '#6b7280',
      };
      setColumns([...columns, newColumn]);
      setNewColumnName('');
    }
    setShowNewColumnInput(false);
  };

  const deleteColumn = () => {
    if (selectedColumn?.tasks.length) return;
    setColumns((cols) => cols.filter((col) => col.id !== selectedColumn!.id));
    setSelectedColumn(null);
  };

  const exportData = () => {
    const data = { columns, boardTitle };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-board.json';
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setColumns(data.columns);
        setBoardTitle(data.boardTitle);
      } catch (error) {
        alert('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
          : col
      )
    );
  };

  const handleColumnNameChange = (id: string, name: string) => {
    setColumns((cols) =>
      cols.map((col) => (col.id === id ? { ...col, name } : col))
    );
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            className="text-3xl font-bold bg-transparent dark:text-white mb-4 md:mb-0"
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              importData(e);
              closeMobileMenu();
            }}
          />

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
          >
            <FaBars />
          </button>

          {/* Mobile Menu */}
          <div
            ref={menuRef}
            className={`${
              isMobileMenuOpen ? 'flex' : 'hidden'
            } md:hidden flex-col fixed right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4 z-50`}
          >
            <div className="flex">
              <a
                href="https://github.com/mitsuoyg/task-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-black dark:text-white cursor-pointer flex justify-center w-full"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://mitsuo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-black dark:text-white cursor-pointer flex justify-center w-full"
              >
                <img src={logo} alt="About Me" className="w-6 h-6" />
              </a>
            </div>
            <button
              onClick={() => {
                exportData();
                closeMobileMenu();
              }}
              className="px-4 py-2 rounded-lg border-2 border-gray-600 text-gray-600 dark:text-gray-400 bg-transparent cursor-pointer flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-900/20"
            >
              <FaFileExport />
              <span className="ml-2">Export</span>
            </button>
            <button
              onClick={() => {
                handleImportClick();
                closeMobileMenu();
              }}
              className="px-4 py-2 rounded-lg border-2 border-gray-600 text-gray-600 dark:text-gray-400 bg-transparent cursor-pointer flex items-center w-full hover:bg-gray-50 dark:hover:bg-gray-900/20"
            >
              <FaFileImport />
              <span className="ml-2">Import</span>
            </button>
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                closeMobileMenu();
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white cursor-pointer flex items-center w-full"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              <span className="ml-2">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>
            <button
              onClick={() => {
                setShowNewColumnInput(true);
                closeMobileMenu();
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white cursor-pointer flex items-center w-full"
            >
              <FaPlus />
              <span className="ml-2">Add Column</span>
            </button>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex gap-4">
            <div className="flex">
              <a
                href="https://github.com/mitsuoyg/task-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-black dark:text-white cursor-pointer flex items-center"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://mitsuo.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-black dark:text-white cursor-pointer flex items-center"
              >
                <img src={logo} alt="About Me" className="w-6 h-6" />
              </a>
            </div>
            <button
              onClick={exportData}
              className="px-4 py-2 rounded-lg border-2 border-gray-600 text-gray-600 dark:text-gray-400 bg-transparent cursor-pointer flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/20"
            >
              <FaFileExport />
              <span className="ml-2">Export</span>
            </button>
            <button
              onClick={handleImportClick}
              className="px-4 py-2 rounded-lg border-2 border-gray-600 text-gray-600 dark:text-gray-400 bg-transparent cursor-pointer flex items-center hover:bg-gray-50 dark:hover:bg-gray-900/20"
            >
              <FaFileImport />
              <span className="ml-2">Import</span>
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white cursor-pointer flex items-center"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              <span className="ml-2">
                {theme === 'dark' ? 'Light' : 'Dark'}
              </span>
            </button>
            <button
              onClick={() => setShowNewColumnInput(true)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white cursor-pointer flex items-center"
            >
              <FaPlus />
              <span className="ml-2">Add Column</span>
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            <AnimatePresence>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  onTaskClick={(task) => setSelectedTask(task as TaskType)}
                  onColumnClick={setSelectedColumn}
                  onColumnNameChange={handleColumnNameChange}
                />
              ))}
            </AnimatePresence>

            {showNewColumnInput && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-w-[300px] bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
              >
                <input
                  autoFocus
                  value={newColumnName}
                  placeholder="Enter column name"
                  onChange={(e) => setNewColumnName(e.target.value)}
                  onBlur={handleColumnSubmit}
                  onKeyPress={(e) => e.key === 'Enter' && handleColumnSubmit()}
                  className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </motion.div>
            )}
          </div>
        </DragDropContext>
      </div>

      <TaskModal
        isOpen={!!selectedTask}
        onClose={() => {
          setSelectedTask(null);
        }}
        task={selectedTask as TaskType}
        onSubmit={handleTaskSubmit}
        columns={columns}
        deleteTask={deleteTask}
      />

      <ColumnModal
        isOpen={!!selectedColumn}
        onClose={() => setSelectedColumn(null)}
        column={selectedColumn}
        onDelete={deleteColumn}
        setColumns={setColumns}
      />
    </div>
  );
};

export default TaskManager;
