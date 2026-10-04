import type { Asset } from '../types';
import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, UserCheck, RotateCcw } from 'lucide-react';
import { api } from '../api';

export const AssetRegisterView: React.FC<{ userRole: string }> = ({ userRole }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [options, setOptions] = useState<any>({ statuses: [], types: [] });

  const [showFormModal, setShowFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [formData, setFormData] = useState<Partial<Asset>>({
    'Asset ID': '', 'Asset Type': 'Laptop', Brand: '', Model: '', 'Serial No.': '',
    'Purchase Date': '', 'Purchase Cost': '', 'Assigned To': '', Department: '',
    Location: '', Status: 'Available', Condition: 'New', 'Warranty Until': '', Vendor: '', Remarks: ''
  });

  const [assignData, setAssignData] = useState({ Employee: '', Department: '', Remarks: '' });
  const [returnData, setReturnData] = useState({ 'Returned Condition': 'Good', Remarks: '' });

  useEffect(() => {
    loadAssets();
  }, [search, statusFilter, typeFilter]);

  const loadAssets = async () => {
    setLoading(true);
    const res = await api.getAssets({ query: search, status: statusFilter, type: typeFilter });
    setAssets(res.assets);
    setOptions(res.options);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !selectedAsset;
    try {
      await api.saveAsset(formData as Asset, isNew);
      setShowFormModal(false);
      loadAssets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (confirm(`Are you sure you want to delete Asset ${assetId}?`)) {
      await api.deleteAsset(assetId);
      loadAssets();
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      await api.assignAsset({
        'Asset ID': selectedAsset['Asset ID'],
        Employee: assignData.Employee,
        Department: assignData.Department,
        Remarks: assignData.Remarks
      });
      setShowAssignModal(false);
      loadAssets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;
    try {
      await api.returnAsset({
        'Asset ID': selectedAsset['Asset ID'],
        'Returned Condition': returnData['Returned Condition'],
        Remarks: returnData.Remarks
      });
      setShowReturnModal(false);
      loadAssets();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canEdit = userRole === 'IT Admin' || userRole === 'IT Technician';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Asset Register</h2>
          <p className="text-slate-400 text-sm mt-0.5">Manage full hardware lifecycle, assignments and physical status</p>
        </div>

        {canEdit && (
          <button
            onClick={() => {
              setSelectedAsset(null);
              setFormData({
                'Asset ID': 'AST-' + String(Math.floor(100 + Math.random() * 900)),
                'Asset Type': 'Laptop', Brand: '', Model: '', 'Serial No.': '',
                'Purchase Date': new Date().toISOString().split('T')[0], 'Purchase Cost': '',
                'Assigned To': '', Department: '', Location: '', Status: 'Available', Condition: 'New',
                'Warranty Until': '', Vendor: '', Remarks: ''
              });
              setShowFormModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Asset</span>
          </button>
        )}
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-3 backdrop-blur-md">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, Brand, Model, Employee or Serial..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
        >
          <option value="">All Statuses</option>
          {options.statuses?.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
        >
          <option value="">All Asset Types</option>
          {options.types?.map((t: string) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Asset ID</th>
                <th className="p-4">Equipment Details</th>
                <th className="p-4">Assigned Employee</th>
                <th className="p-4">Department & Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Condition</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Loading asset register...</td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">No assets found matching the specified filters.</td>
                </tr>
              ) : (
                assets.map(asset => (
                  <tr key={asset['Asset ID']} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-mono font-bold text-cyan-400">{asset['Asset ID']}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{asset.Brand} {asset.Model}</div>
                      <div className="text-[11px] text-slate-400">{asset['Asset Type']} • S/N: {asset['Serial No.']}</div>
                    </td>
                    <td className="p-4">
                      {asset['Assigned To'] ? (
                        <span className="font-medium text-slate-200">{asset['Assigned To']}</span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300">{asset.Department || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500">{asset.Location || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        asset.Status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        asset.Status === 'Assigned' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        asset.Status === 'Under Repair' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {asset.Status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{asset.Condition}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canEdit && asset.Status === 'Available' && (
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              setAssignData({ Employee: '', Department: asset.Department || 'Engineering', Remarks: '' });
                              setShowAssignModal(true);
                            }}
                            title="Assign to Employee"
                            className="p-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {canEdit && asset.Status === 'Assigned' && (
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              setReturnData({ 'Returned Condition': asset.Condition || 'Good', Remarks: '' });
                              setShowReturnModal(true);
                            }}
                            title="Return Asset"
                            className="p-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-lg transition"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {canEdit && (
                          <button
                            onClick={() => {
                              setSelectedAsset(asset);
                              setFormData(asset);
                              setShowFormModal(true);
                            }}
                            title="Edit Asset Details"
                            className="p-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {userRole === 'IT Admin' && (
                          <button
                            onClick={() => handleDelete(asset['Asset ID'])}
                            title="Delete Asset"
                            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-100">{selectedAsset ? 'Edit Asset' : 'Add New Hardware Asset'}</h3>
            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Asset ID</label>
                <input
                  required
                  disabled={!!selectedAsset}
                  value={formData['Asset ID']}
                  onChange={e => setFormData({ ...formData, 'Asset ID': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Asset Type</label>
                <input
                  required
                  value={formData['Asset Type']}
                  onChange={e => setFormData({ ...formData, 'Asset Type': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  placeholder="e.g. Laptop, Monitor, Printer"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Brand</label>
                <input
                  required
                  value={formData.Brand}
                  onChange={e => setFormData({ ...formData, Brand: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Model</label>
                <input
                  required
                  value={formData.Model}
                  onChange={e => setFormData({ ...formData, Model: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Serial Number</label>
                <input
                  required
                  value={formData['Serial No.']}
                  onChange={e => setFormData({ ...formData, 'Serial No.': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Purchase Cost (₹)</label>
                <input
                  type="number"
                  value={formData['Purchase Cost']}
                  onChange={e => setFormData({ ...formData, 'Purchase Cost': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <input
                  value={formData.Department}
                  onChange={e => setFormData({ ...formData, Department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Location</label>
                <input
                  value={formData.Location}
                  onChange={e => setFormData({ ...formData, Location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 text-white font-medium rounded-xl hover:bg-cyan-400"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Assign Asset: {selectedAsset['Asset ID']}</h3>
            <form onSubmit={handleAssign} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Employee Name</label>
                <input
                  required
                  value={assignData.Employee}
                  onChange={e => setAssignData({ ...assignData, Employee: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Department</label>
                <input
                  required
                  value={assignData.Department}
                  onChange={e => setAssignData({ ...assignData, Department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-xl">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReturnModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Return Asset: {selectedAsset['Asset ID']}</h3>
            <form onSubmit={handleReturn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Returned Condition</label>
                <select
                  value={returnData['Returned Condition']}
                  onChange={e => setReturnData({ ...returnData, 'Returned Condition': e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowReturnModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-xl">Confirm Return</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
