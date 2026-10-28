import { X, CheckCircle2, Cpu, Sparkles, CalendarCheck } from 'lucide-react';
import { GamingStation } from '../types';

interface StationDetailModalProps {
  station: GamingStation | null;
  onClose: () => void;
  onBook: (stationId: string) => void;
}

export default function StationDetailModal({ station, onClose, onBook }: StationDetailModalProps) {
  if (!station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-700/80 bg-[#0d0d16] text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with image */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <img
            src={station.image}
            alt={station.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d16] via-[#0d0d16]/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-neutral-300 hover:text-white hover:bg-black/90 transition-all border border-neutral-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
              Station Specifications
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-1">
              {station.title}
            </h2>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-neutral-300 text-sm leading-relaxed">
            {station.description}
          </p>

          {/* Detailed specs grid */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4" />
              <span>Hardware & Component Architecture</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {station.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col"
                >
                  <span className="text-xs text-neutral-400 font-medium">{spec.label}</span>
                  <span className="text-sm font-semibold text-neutral-100 mt-0.5">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4" />
              <span>Included Perks & Experience</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {station.features.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-sm text-neutral-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Games */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Optimized Games Ready to Launch
            </h3>
            <div className="flex flex-wrap gap-2 text-xs text-neutral-300">
              {station.popularGames.map((game, i) => (
                <span key={game} className="bg-neutral-800/80 px-2.5 py-1 rounded-md border border-neutral-700/60">
                  {game}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-neutral-800/80 bg-neutral-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-display tabular-nums">
              ${station.hourlyRate}
            </span>
            <span className="text-xs text-neutral-400 font-medium">/ hour base rate</span>
            <span className="text-xs text-purple-400 font-medium ml-2">
              (Multi-hour discounts available)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white rounded-lg border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(station.id);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Book This Station</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
