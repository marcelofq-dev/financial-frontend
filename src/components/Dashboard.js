// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = `${process.env.REACT_APP_API_URL}/api/expenses`;

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Geral' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Função para configurar os headers da API com o token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Se não houver token, desloga (é uma segurança extra)
      handleLogout();
      return {};
    }
    // Formato "Bearer TOKEN"
    return { headers: { 'Authorization': `Bearer ${token}` } };
  };

  // 1. Buscar gastos quando o componente carregar
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(API_URL, getAuthHeaders());
        setExpenses(res.data);
      } catch (err) {
        // Se o token for inválido (ex: expirado), o back-end
        // retornará 401 (Unauthorized), e deslogamos o usuário.
        if (err.response && err.response.status === 401) {
          handleLogout();
        } else {
          setError('Erro ao buscar gastos.');
        }
      }
    };
    fetchExpenses();
  }, []); // O array vazio [] faz isso rodar só uma vez, no "mount"

  // 2. Adicionar um novo gasto
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) {
      return setError('Descrição e valor são obrigatórios.');
    }
    
    try {
      const res = await axios.post(API_URL, newExpense, getAuthHeaders());
      // Adiciona o novo gasto no topo da lista
      setExpenses([res.data, ...expenses]);
      // Limpa o formulário
      setNewExpense({ description: '', amount: '', category: 'Geral' });
      setError('');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        handleLogout();
      } else {
        setError('Erro ao adicionar gasto.');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  // 3. Logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpa o token
    navigate('/login'); // Redireciona para o login
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      <h2>Dashboard de Gastos</h2>

      {/* Formulário para Adicionar Gasto */}
      <h3>Adicionar Novo Gasto</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddExpense}>
        <input 
          type="text" 
          name="description" 
          placeholder="Descrição (ex: Almoço)" 
          value={newExpense.description}
          onChange={handleInputChange} 
        />
        <input 
          type="number" 
          name="amount" 
          placeholder="Valor (ex: 25.50)" 
          value={newExpense.amount}
          onChange={handleInputChange} 
        />
        <select name="category" value={newExpense.category} onChange={handleInputChange}>
          <option value="Geral">Geral</option>
          <option value="Alimentação">Alimentação</option>
          <option value="Transporte">Transporte</option>
          <option value="Lazer">Lazer</option>
          <option value="Moradia">Moradia</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>

      {/* Lista de Gastos */}
      <h3>Seus Gastos</h3>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {expenses.length === 0 ? (
          <p>Nenhum gasto cadastrado.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {expenses.map((expense) => (
              <li key={expense._id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                <strong>{expense.description}</strong> - R$ {expense.amount.toFixed(2)}
                <br />
                <small>Categoria: {expense.category} | Data: {new Date(expense.date).toLocaleDateString('pt-BR')}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;