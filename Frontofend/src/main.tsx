
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Vite handles the .tsx extension automatically
import './index.css';     // Ensure your Tailwind/YOLO styles are here

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);