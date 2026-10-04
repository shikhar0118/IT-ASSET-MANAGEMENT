import type { Ticket as TicketType } from '../types';
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { api } from '../api';

export const TicketsView: React.FC<{ userRole: string }> = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  const [formData, setFormData] = useState<Partial<TicketType>>({
    'Ticket ID': '', 'Raised By': '', Employee: '', Department: '', Category: 'Hardware',
    Priority: 'Medium', Subject: '', Description: '', 'Assigned To': '', Status: 'Open'
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    const res = await api.getTickets();
    setTickets(res.tickets);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveTicket(formData as TicketType, !selectedTicket);
      setShowModal(false);
      loadTickets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">IT Helpdesk Tickets</h2>
          <p className="text-slate-400 text-sm mt-0.5">Employee hardware & software support requests</p>
        </div>

        <button
          onClick={() => {
            setSelectedTicket(null);
            setFormData({
              'Ticket ID': 'TKT-' + String(Math.floor(100 + Math.random() * 900)),
              'Raised By': 'Current User', Employee: '', Department: 'Engineering', Category: 'Hardware',
              Priority: 'Medium', Subject: '', Description: '', 'Assigned To': '', Status: 'Open'
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-4">Ticket ID</th>
              <th className="p-4">Subject & Description</th>
              <th className="p-4">Raised By</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading tickets...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">No support tickets active.</td></tr>
            ) : (
              tickets.map(t => (
                <tr key={t['Ticket ID']} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-mono font-bold text-cyan-400">{t['Ticket ID']}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{t.Subject}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-sm">{t.Description}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-200">{t['Raised By']}</div>
                    <div className="text-[11px] text-slate-500">{t.Department}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      t.Priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      t.Priority === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {t.Priority}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{t['Assigned To'] || 'Unassigned'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      t.Status === 'Resolved' || t.Status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400' :
                      t.Status === 'In Progress' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {t.Status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedTicket(t);
                        setFormData(t);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-lg hover:bg-slate-700"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">{selectedTicket ? 'Update Ticket' : 'Raise Support Ticket'}</h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Subject</label>
                <input
                  required
                  value={formData.Subject}
                  onChange={e => setFormData({ ...formData, Subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.Description}
                  onChange={e => setFormData({ ...formData, Description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={formData.Priority}
                    onChange={e => setFormData({ ...formData, Priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.Status}
                    onChange={e => setFormData({ ...formData, Status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-xl">Save Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
