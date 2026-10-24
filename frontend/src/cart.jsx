import React from 'react';
import ReactDOM from 'react-dom/client';
import Cart from './components/Cart.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Cart />
    </AuthProvider>
  </React.StrictMode>,
);
