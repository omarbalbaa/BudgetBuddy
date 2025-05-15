import { useEffect, useState } from 'react';
import API from '../api/axiosClient';

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState({ category: '', from: '', to: '' });
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchExpenses = async () => {
    const params = {};
    if (filter.category) params.category = filter.category;
    if (filter.from) params.fromDate = filter.from;
    if (filter.to) params.toDate = filter.to;
    
    try {
      const res = await API.get('/expenses', { params });
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const startEdit = (expense) => {
    setEditingExpense(expense.id);
    setEditForm({ ...expense });
  };

  const cancelEdit = () => {
    setEditingExpense(null);
    setEditForm({});
  };

  const handleEdit = async (id) => {
    try {
      await API.put(`/expenses/${id}`, editForm);
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  useEffect(() => { 
    fetchExpenses(); 
  }, [filter]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Expenses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Category filter */}
        <div className="w-full">
          <input
            placeholder="Filter by category"
            className="w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            onChange={e => setFilter(prev => ({ ...prev, category: e.target.value }))}
            value={filter.category}
          />
        </div>

        {/* Date range filter */}
        <div className="grid grid-cols-2 gap-2 items-center">
          <input
            type="date"
            className="w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            onChange={e => setFilter(prev => ({ ...prev, from: e.target.value }))}
            value={filter.from}
          />
          <input
            type="date"
            className="w-full rounded-md p-2 border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            onChange={e => setFilter(prev => ({ ...prev, to: e.target.value }))}
            value={filter.to}
          />
        </div>

        {/* Clear filters button */}
        <div className="w-full">
          <button
            onClick={() => setFilter({ category: '', from: '', to: '' })}
            className="w-full h-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.length > 0 ? (
              expenses.map(exp => (
                <tr key={exp.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExpense === exp.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.amount}
                        onChange={e => setEditForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-24 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    ) : (
                      `$${exp.amount}`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExpense === exp.id ? (
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    ) : (
                      exp.category
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingExpense === exp.id ? (
                      <input
                        type="date"
                        value={editForm.date}
                        onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-32 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    ) : (
                      new Date(exp.date).toLocaleDateString()
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingExpense === exp.id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">{exp.description || '-'}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {editingExpense === exp.id ? (
                        <>
                          <button
                            onClick={() => handleEdit(exp.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(exp)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No expenses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}