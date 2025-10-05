import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress Three.js multiple instances warning
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes?.('Multiple instances of Three.js')) {
    return;
  }
  originalWarn(...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
