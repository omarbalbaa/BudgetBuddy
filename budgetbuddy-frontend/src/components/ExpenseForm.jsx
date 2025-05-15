import { useState } from 'react';
import API from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function ExpenseForm() {
  const [form, setForm] = useState({ amount: '', category: '', date: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/expenses', form);
      setForm({ amount: '', category: '', date: '', description: '' });
      window.location.reload();
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to add expense');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Expense</h3>
      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="amount"
          type="number"
          step="0.01"
          required
          placeholder="Amount"
          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          onChange={handleChange}
        />
        <input
          name="category"
          required
          placeholder="Category"
          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          required
          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Add Expense
      </button>
    </form>
  );
}
