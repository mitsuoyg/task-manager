// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // Removed StrictMode as it makes drag and drop unusable
  // <StrictMode>
  <App />
  // </StrictMode>,
);
