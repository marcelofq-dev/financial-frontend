// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rota Protegida */}
          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } 
          />
          
          {/* Redirecionamento Padrão */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componente simples para proteger rotas
function AuthGuard({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    // Se não há token, redireciona para o login
    return <Navigate to="/login" replace />;
  }
  // Se há token, renderiza o componente filho (Dashboard)
  return children;
}

export default App;