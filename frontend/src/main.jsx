import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { RouterProvider } from 'react-router-dom';
import {  HelmetProvider } from "react-helmet-async";
import router from './routes';
import { Provider  } from 'react-redux';
import { store } from './store/store';

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
  <HelmetProvider>
      <RouterProvider router={router}/>
  </HelmetProvider>
    </Provider>
  // </React.StrictMode>
);


