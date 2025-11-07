// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = `${process.env.REACT_APP_API_URL}/api/users`;

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      
      // A mágica acontece aqui:
      localStorage.setItem('token', res.data.token); // Salva o token
      
      navigate('/dashboard'); // Redireciona para o dashboard
    } catch (err) {
      setError(err.response.data.msg || 'Erro ao fazer login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={onChange} required />
        <input type="password" name="password" placeholder="Senha" onChange={onChange} required />
        <button type="submit">Entrar</button>
      </form>
      <p>Não tem uma conta? <Link to="/register">Registre-se</Link></p>
    </div>
  );
}

export default Login;