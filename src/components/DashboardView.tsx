import type { DashboardData } from '../types';
import React, { useEffect, useState } from 'react';
import { Laptop, Wrench, IndianRupee, Printer, TrendingUp } from 'lucide-react';
import { api } from '../api';

export const DashboardView: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const res = await api.getDashboardData();
    setData(res);
    setLoading(false);
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <span className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading Executive IT Dashboard...</span>
      </div>
    );
  }

  const formatRupee = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">IT Systems Overview</h2>
          <p className="text-slate-400 text-sm mt-0.5">Real-time status across assets, repairs, and infrastructure expenses</p>
        </div>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
        >
          Refresh Live Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Hardware Assets</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{data.kpis.totalAssets}</h3>
            </div>
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Laptop className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {data.kpis.assigned} Assigned
            </span>
            <span>•</span>
            <span>{data.kpis.available} Available</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Under Maintenance</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-2">{data.kpis.underRepair}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <span>{data.kpis.damaged} Assets reported damaged</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventory Valuation</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">{formatRupee(data.kpis.totalValue)}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <span>Cumulative asset cost</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Printers & Cartridges</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-2">{data.printerSummary.printers}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Printer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400">
            <span>{data.printerSummary.cartridges} Active cartridges tracked</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h4 className="text-sm font-semibold text-slate-200 mb-4 flex items-center justify-between">
              <span>Assets by Category</span>
              <span className="text-xs text-slate-500">{data.assetTypes.length} categories</span>
            </h4>
            <div className="space-y-3">
              {data.assetTypes.map((t, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-300">
                    <span>{t.label}</span>
                    <span className="text-slate-400">{t.value} units</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (t.value / data.kpis.totalAssets) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Department Allocations</h4>
            <div className="space-y-2.5">
              {data.departments.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
                  <span className="text-slate-300 font-medium">{d.label}</span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-semibold">{d.value} assets</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h4 className="text-sm font-semibold text-slate-200 mb-4 flex items-center justify-between">
              <span>Monthly Expense Expenditure</span>
              <span className="text-xs text-cyan-400 font-medium">YTD 2026</span>
            </h4>
            <div className="h-36 flex items-end justify-between gap-2 pt-6">
              {data.monthlyExpenses.map((m, idx) => {
                const max = Math.max(...data.monthlyExpenses.map(x => x.value), 1);
                const heightPercent = Math.max(8, (m.value / max) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full bg-slate-800/80 hover:bg-cyan-500/80 rounded-t-lg transition-all" style={{ height: `${heightPercent}%` }}>
                      {m.value > 0 && (
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-[10px] text-cyan-300 px-2 py-1 rounded border border-slate-700 whitespace-nowrap z-10 transition">
                          {formatRupee(m.value)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h4 className="text-sm font-semibold text-slate-200 mb-4">Recent Maintenance & Repairs</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Repair ID</th>
                    <th className="p-3">Asset ID</th>
                    <th className="p-3">Issue</th>
                    <th className="p-3">Cost</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {data.recentRepairs.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-semibold text-slate-200">{r['Repair ID']}</td>
                      <td className="p-3 text-cyan-400 font-mono">{r['Asset ID']}</td>
                      <td className="p-3 truncate max-w-xs">{r['Problem / Damage']}</td>
                      <td className="p-3 font-medium">{formatRupee(Number(r['Repair Cost']) || 0)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          r.Status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {r.Status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
