import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './reidars.css';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('reidars-stats-app'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);