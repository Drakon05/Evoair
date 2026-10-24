import React from 'react';
import ReactDOM from 'react-dom/client';
import Products from './components/Products.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Products />
    </AuthProvider>
  </React.StrictMode>,
);
