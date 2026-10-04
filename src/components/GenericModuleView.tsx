import React, { useEffect, useState } from 'react';
import { api } from '../api';

export const GenericModuleView: React.FC<{ moduleName: string; userRole: string }> = ({ moduleName }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [moduleName]);

  const loadData = async () => {
    setLoading(true);
    if (moduleName === 'departments') {
      const res = await api.getDepartments();
      setData(res.departments);
    } else if (moduleName === 'expenses') {
      const res = await api.getExpenses();
      setData(res.expenses);
    } else if (moduleName === 'cartridges') {
      const res = await api.getCartridges();
      setData(res.cartridges);
    } else if (moduleName === 'users') {
      const res = await api.getUsers();
      setData(res.users);
    } else if (moduleName === 'audit') {
      const res = await api.getAuditLogs();
      setData(res.logs);
    }
    setLoading(false);
  };

  const getTitle = () => {
    switch (moduleName) {
      case 'departments': return 'Department Units';
      case 'expenses': return 'IT Expenses & Maintenance Billing';
      case 'cartridges': return 'Printer & Toner Inventory';
      case 'users': return 'System Users & Role Access';
      case 'audit': return 'Audit Logs & Governance';
      default: return moduleName;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 capitalize">{getTitle()}</h2>
          <p className="text-slate-400 text-sm mt-0.5">Live Gas spreadsheet records for {moduleName}</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading module records...</div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No records found.</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  {Object.keys(data[0]).map(key => (
                    <th key={key} className="p-4">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    {Object.values(row).map((val: any, j) => (
                      <td key={j} className="p-4 truncate max-w-xs font-mono">
                        {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
