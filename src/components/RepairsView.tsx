import type { Repair } from '../types';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../api';

export const RepairsView: React.FC<{ userRole: string }> = ({ userRole }) => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);

  const [formData, setFormData] = useState<Partial<Repair>>({
    'Repair ID': '', 'Asset ID': '', Employee: '', 'Damage Date': new Date().toISOString().split('T')[0],
    'Problem / Damage': '', 'Vendor / Repairer': '', 'Repair Cost': '', Status: 'Pending', Remarks: ''
  });

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    setLoading(true);
    const res = await api.getRepairs();
    setRepairs(res.repairs);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveRepair(formData as Repair, !selectedRepair);
      setShowModal(false);
      loadRepairs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canEdit = userRole === 'IT Admin' || userRole === 'IT Technician';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Repairs & Damage Tracker</h2>
          <p className="text-slate-400 text-sm mt-0.5">Track ongoing maintenance, damage reports and vendor costs</p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setSelectedRepair(null);
              setFormData({
                'Repair ID': 'REP-' + String(Math.floor(100 + Math.random() * 900)),
                'Asset ID': '', Employee: '', 'Damage Date': new Date().toISOString().split('T')[0],
                'Problem / Damage': '', 'Vendor / Repairer': '', 'Repair Cost': '', Status: 'Pending', Remarks: ''
              });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Repair Case</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Repair ID</th>
              <th className="p-4">Asset ID</th>
              <th className="p-4">Reported Issue</th>
              <th className="p-4">Vendor / Repairer</th>
              <th className="p-4">Cost (₹)</th>
              <th className="p-4">Status</th>
              {canEdit && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading repairs data...</td></tr>
            ) : repairs.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No repair logs recorded yet.</td></tr>
            ) : (
              repairs.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-mono font-bold text-slate-200">{r['Repair ID']}</td>
                  <td className="p-4 font-mono text-cyan-400 font-semibold">{r['Asset ID']}</td>
                  <td className="p-4 font-medium text-slate-200">{r['Problem / Damage']}</td>
                  <td className="p-4 text-slate-400">{r['Vendor / Repairer'] || 'In-House'}</td>
                  <td className="p-4 font-semibold text-slate-200">₹{Number(r['Repair Cost']) || 0}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      r.Status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      r.Status === 'In Progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {r.Status}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRepair(r);
                          setFormData(r);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700 transition"
                      >
                        Update
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">{selectedRepair ? 'Update Repair' : 'Log Maintenance Case'}</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Asset ID</label>
                <input
                  required
                  value={formData['Asset ID']}
                  onChange={e => setFormData({ ...formData, 'Asset ID': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  placeholder="e.g. AST-004"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Problem / Damage Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData['Problem / Damage']}
                  onChange={e => setFormData({ ...formData, 'Problem / Damage': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vendor / Repairer</label>
                  <input
                    value={formData['Vendor / Repairer']}
                    onChange={e => setFormData({ ...formData, 'Vendor / Repairer': e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Repair Cost (₹)</label>
                  <input
                    type="number"
                    value={formData['Repair Cost']}
                    onChange={e => setFormData({ ...formData, 'Repair Cost': e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Repair Status</label>
                <select
                  value={formData.Status}
                  onChange={e => setFormData({ ...formData, Status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-xl">Save Repair Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
