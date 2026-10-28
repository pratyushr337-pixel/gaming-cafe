import { useState } from 'react';
import { X, Trophy, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tournament } from '../types';
import { registerTournament } from '../lib/api';

interface TournamentRegisterModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  onSuccess: (updated: Tournament) => void;
}

export default function TournamentRegisterModal({
  tournament,
  onClose,
  onSuccess,
}: TournamentRegisterModalProps) {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!tournament) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!captainName || !email || !phone) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerTournament(tournament.id, {
        teamName: teamName || captainName,
        captainName,
        email,
        phone,
      });
      setSuccessMsg(res.message);
      onSuccess({
        ...tournament,
        registeredCount: Math.min(tournament.maxTeams, tournament.registeredCount + 1),
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-700/80 bg-[#0c0c16] text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-[#080811]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold uppercase tracking-tight text-white">
                Tournament Registration
              </h2>
              <span className="text-[11px] text-neutral-400">
                {tournament.game} · {tournament.format}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-white">
              Team Registered!
            </h3>
            <p className="text-sm text-neutral-300 max-w-xs mx-auto">
              {successMsg}
            </p>
            <p className="text-xs text-neutral-400">
              LAN briefing starts 30 minutes before match time on {tournament.date}. Check in at front counter.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-400">Tournament:</span>
                <span className="font-semibold text-white">{tournament.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Date & Time:</span>
                <span className="text-neutral-200">{tournament.date} · {tournament.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Prize Pool:</span>
                <span className="font-bold text-amber-400">{tournament.prizePool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Bracket Capacity:</span>
                <span className="font-mono text-cyan-300">
                  {tournament.registeredCount} / {tournament.maxTeams} Teams
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                Team / Clan Name
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Predators"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                Captain / Player Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Mercer"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="captain@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all"
              >
                {loading ? 'Registering...' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
