import { useState } from 'react';
import { X, Lock, Key, AlertCircle, ShieldCheck } from 'lucide-react';
import { adminLogin } from '../lib/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(password);
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid passcode. Default is "nextlevel2026" or "admin".');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-700/80 bg-[#0d0d17] text-white shadow-2xl overflow-hidden p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold uppercase text-white">
                Staff & Owner Access
              </h2>
              <span className="text-[11px] text-neutral-400">
                Next Level Operations Portal
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-cyan-400" />
              <span>Admin Passcode</span>
            </label>
            <input
              type="password"
              placeholder="Enter passcode..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              autoFocus
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400 space-y-1">
            <div className="font-semibold text-neutral-300">Staff Credentials:</div>
            <div>Passcode: <code className="text-cyan-300 font-mono">nextlevel2026</code> or <code className="text-cyan-300 font-mono">admin</code></div>
            <div>Full permissions: Live reservations, station rates, packages, and walk-in entry.</div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Enter Dashboard'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
