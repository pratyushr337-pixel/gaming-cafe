import { useState } from 'react';
import { CalendarCheck, Info, Check, Sparkles } from 'lucide-react';
import { GamingStation } from '../types';

interface StationsSectionProps {
  stations: GamingStation[];
  onSelectStation: (stationId: string) => void;
  onViewSpecs: (station: GamingStation) => void;
}

export default function StationsSection({ stations, onSelectStation, onViewSpecs }: StationsSectionProps) {
  const [filter, setFilter] = useState<'all' | 'pc' | 'ps5' | 'racing' | 'vip'>('all');

  const filteredStations = filter === 'all' ? stations : stations.filter((s) => s.type === filter);

  const filterTabs = [
    { id: 'all', label: 'All Setups' },
    { id: 'pc', label: 'PC Battlestations' },
    { id: 'ps5', label: 'PlayStation 5' },
    { id: 'racing', label: 'Racing Simulators' },
    { id: 'vip', label: 'VIP Squad Suites' },
  ];

  return (
    <section id="stations" className="relative py-24 border-b border-neutral-800 bg-[#050508]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
              <span>Next Gen Hardware</span>
              <span aria-hidden="true">·</span>
              <span>Esports Grade</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              GAMING STATIONS
            </h2>
            <p className="mt-3 text-neutral-400 max-w-2xl text-base leading-relaxed">
              Every station is calibrated for peak competitive frame rates, tactile control, and immersive sound isolation. Choose your arena.
            </p>
          </div>

          {/* Segmented interactive tab filter */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStations.map((station) => (
            <div
              key={station.id}
              className="group relative rounded-2xl border border-neutral-800/90 bg-[#0a0a12] overflow-hidden hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all flex flex-col"
            >
              {/* Image Container with Fallback */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-950">
                <img
                  src={station.image}
                  alt={station.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/40 to-transparent" />

                {/* Floating availability indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-medium text-emerald-400 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{station.availableUnits} of {station.totalUnits} Ready Now</span>
                </div>

                {station.featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold uppercase text-purple-300 bg-purple-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-500/40">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    <span>Popular</span>
                  </div>
                )}

                {/* Station Title on Image base */}
                <div className="absolute bottom-4 left-6 right-6">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors">
                    {station.title}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-1">
                    {station.tagline}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {station.description}
                </p>

                {/* Features list */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Highlights & Capabilities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-200">
                    {station.features.slice(0, 4).map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Row with Pricing */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl sm:text-3xl font-black text-white tabular-nums">
                        ${station.hourlyRate}
                      </span>
                      <span className="text-xs text-neutral-400">/ hour</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">Walk-in or Reserve</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onViewSpecs(station)}
                      className="px-3.5 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700/80 hover:border-neutral-600 rounded-lg flex items-center gap-1.5 transition-colors"
                      title="View complete hardware specifications"
                    >
                      <Info className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Specs</span>
                    </button>

                    <button
                      onClick={() => onSelectStation(station.id)}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95 transition-all whitespace-nowrap"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      <span>Book Station</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
