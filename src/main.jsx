import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './features/store.js';
import { ServiceProvider } from './context/ServiceContext';
import { EventProvider } from './context/EventContext';
import App from './App.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ServiceProvider>
        <EventProvider>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </EventProvider>
      </ServiceProvider>
    </Provider>
  </StrictMode>
);
