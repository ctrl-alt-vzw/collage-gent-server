import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import './assets/css/index.css';
import App from './App';

import './assets/css/App.css';

import reportWebVitals from './reportWebVitals';

import { ManagerProvider } from "./Manager/index.js"

console.log(process.env)
const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ManagerProvider>
        <App />
      </ManagerProvider>
    ),
  },
  {
    path: "projection",
    element: <div>Projection</div>,
  },
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
