# Task Board: Drag-and-Drop Task Management App

[![Live Demo](https://img.shields.io/badge/Live_Demo-000?style=for-the-badge)](https://mitsuo-task-board.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/mitsuoyg/task-manager)

A dynamic task management application with intuitive drag-and-drop functionality and customizable workflows.

## Features

- 🖱️ Drag-and-Drop Interface: Easily move tasks between columns
- 🎨 Customizable Workflow: Create, rename, and organize task columns
- 🌓 Theme Switching: Light/dark mode support
- 📁 Data Portability: Import/export task boards via JSON
- 📱 Responsive Design: Works seamlessly across devices
- 💾 Local Storage: Automatic data persistence

## Tech Stack

**Frontend:**

- React.js + TypeScript
- Tailwind CSS + Framer Motion
- @hello-pangea/dnd (Beautiful DnD)

**State Management:**

- Local storage persistence
- React Context API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/mitsuoyg/task-manager.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Usage

- **Create Tasks:** Click "+ Add Task" in any column.
- **Organize:** Drag tasks between columns.
- **Customize:** Right-click columns to rename or delete them.
- **Themes:** Toggle light/dark mode in the header.
- **Data Management:** Use import/export options in the settings menu.
