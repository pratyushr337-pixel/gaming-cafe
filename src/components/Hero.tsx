import { CalendarCheck, ChevronRight, Cpu, Wifi, Monitor, Clock } from 'lucide-react';
import { HERO_IMAGE } from '../data/initialData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreSetup: () => void;
}

export default function Hero({ onOpenBooking, onExploreSetup }: HeroProps) {
  const stats = [
    {
      icon: Cpu,
      value: '48 Rigs',
      label: 'RTX 4080 Super & 4090 Rigs',
      accent: 'text-purple-400',
    },
    {
      icon: Wifi,
      value: '1 Gbps',
      label: 'Dedicated Symmetric Fiber',
      accent: 'text-cyan-400',
    },
    {
      icon: Monitor,
      value: '360Hz',
      label: 'Ultra-Fast OLED Tournament Panels',
      accent: 'text-purple-400',
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Weekend Non-Stop LAN Sessions',
      accent: 'text-cyan-400',
    },
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-neutral-800">
      {/* Background Graphic & Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Next Level Gaming Cafe interior lounge and battlestations"
          className="h-full w-full object-cover object-center scale-105 filter brightness-75 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Gradients and cyber overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/85 to-[#050508]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-transparent to-[#050508]/90" />
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

        {/* Ambient colored glow orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 translate-x-1/3 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-20 pb-12 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Natural human editorial kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            <span>Next Gen Esports Lounge</span>
            <span aria-hidden="true">·</span>
            <span>Metro City</span>
            <span aria-hidden="true">·</span>
            <span className="text-purple-400">Now Booking</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] text-balance">
            ENTER THE GAME.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent glow-text-purple">
              OWN THE NIGHT.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-normal text-neutral-300 max-w-2xl leading-relaxed">
            Your ultimate gaming destination. Play, compete, and connect with high-end RTX graphics, 360Hz displays, PS5 lounges, direct-drive racing cockpits, and full-service cafe refreshments.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenBooking}
              className="flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 transition-all whitespace-nowrap shrink-0 group"
            >
              <CalendarCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span>Book Your Session</span>
            </button>

            <button
              onClick={onExploreSetup}
              className="flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold uppercase tracking-wider text-neutral-200 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 hover:border-purple-500/50 rounded-xl hover:text-white transition-all whitespace-nowrap shrink-0"
            >
              <span>Explore Our Setup</span>
              <ChevronRight className="h-4 w-4 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width 4-Column Proof / KPI Strip */}
      <div className="relative z-10 w-full border-t border-neutral-800/80 bg-[#07070ef2] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 group transition-colors"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-purple-500/50 group-hover:bg-purple-950/20 transition-all">
                    <Icon className={`h-6 w-6 ${stat.accent}`} />
                  </div>
                  <div>
                    <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs text-neutral-400 leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
