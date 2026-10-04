import React, { useState } from 'react';
import { Server, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../api';

interface LoginModalProps {
  onSuccess: (user: { email: string; name: string; role: 'IT Admin' | 'IT Technician' | 'Viewer' }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email, password);
      if (res.success) {
        onSuccess({ email: res.email || '', name: res.name || '', role: res.role as any });
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-4">
            <Server className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">IT Asset Portal</h2>
          <p className="text-sm text-slate-400 mt-1">Enterprise Hardware & Inventory Operations</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-11 pr-4 py-2.5 text-slate-200 text-sm placeholder-slate-600 transition"
                placeholder="admin@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-11 pr-4 py-2.5 text-slate-200 text-sm placeholder-slate-600 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to System</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 font-medium mb-2">Demo Roles Quick Switch:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setEmail('admin@company.com'); setPassword('admin123'); }}
              className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-700/50 text-center transition cursor-pointer"
            >
              Admin
            </button>
            <button
              onClick={() => { setEmail('tech@company.com'); setPassword('tech123'); }}
              className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-700/50 text-center transition cursor-pointer"
            >
              Technician
            </button>
            <button
              onClick={() => { setEmail('viewer@company.com'); setPassword('viewer123'); }}
              className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-700/50 text-center transition cursor-pointer"
            >
              Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
