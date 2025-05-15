import { useEffect, useState } from 'react';
import API from '../api/axiosClient';

export default function Report() {
  const [monthly, setMonthly] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const res = await API.get('/expenses');
      const byMonth = {};
      res.data.forEach(exp => {
        const month = exp.date.slice(0, 7);
        byMonth[month] = (byMonth[month] || 0) + parseFloat(exp.amount);
      });
      setMonthly(byMonth);
    };
    fetch();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Report</h3>
      <div className="space-y-4">
        {Object.entries(monthly).map(([month, total]) => (
          <div key={month} className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500">{month}</div>
            <div className="text-2xl font-semibold text-gray-900">
              ${total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
