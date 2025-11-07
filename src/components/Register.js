// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/users'; // URL do seu back-end

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Não precisamos do token aqui, pois é registro
      await axios.post(`${API_URL}/register`, formData);
      navigate('/login'); // Redireciona para login após registro
    } catch (err) {
      setError(err.response.data.msg || 'Erro ao registrar');
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" placeholder="Nome" onChange={onChange} required />
        <input type="email" name="email" placeholder="Email" onChange={onChange} required />
        <input type="password" name="password" placeholder="Senha" onChange={onChange} required />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
    </div>
  );
}

export default Register;