import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css'; 
import './App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element:
      <App />,
    //errorElement
  },
  /*
  {
    path: "about",
    element:
      <HomePage
        ApiUrl="https://dgdemo23.tundramedia.net/api/api.php?albumid=2059494&verify=true"
        ContentAbout
        MetaTitle="About | Directors Guild"
      />,
  },
  */
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);