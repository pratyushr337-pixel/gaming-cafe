import { ShieldCheck, Zap, HeartHandshake, Coffee, Check, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export default function AboutSection({ onOpenBooking }: AboutSectionProps) {
  const pillars = [
    {
      icon: Zap,
      title: 'Bleeding-Edge Hardware',
      description: 'Every rig is custom-engineered with NVIDIA GeForce RTX 4080 Super and 4090 GPUs, Core i9 liquid-cooled processors, and 360Hz fast-IPS and OLED panels.',
    },
    {
      icon: ShieldCheck,
      title: 'Dedicated Gigabit Fiber LAN',
      description: 'Zero packet loss, enterprise-grade QoS routing, and unthrottled 1 Gbps symmetric fiber. Ping times under 5ms to regional competitive game servers.',
    },
    {
      icon: HeartHandshake,
      title: 'Ergonomics & Acoustic Comfort',
      description: 'Official Secretlab Titan Evo ergonomic gaming chairs, custom carbon fiber battlestations, and sound-absorbing acoustic acoustic geometry for focused play.',
    },
    {
      icon: Coffee,
      title: 'Artisan Cafe & Fuel Bar',
      description: 'Freshly roasted barista coffee, imported Japanese sodas, chilled energy drinks, artisan smash burgers, and loaded gamer snacks served directly to your seat.',
    },
  ];

  return (
    <section id="about" className="relative py-24 border-b border-neutral-800 bg-[#070710]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Main story grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-400">
              <span>The Next Level Philosophy</span>
              <span aria-hidden="true">·</span>
              <span>Built by Gamers, for Gamers</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              WHERE PASSION MEETS PURE PERFORMANCE.
            </h2>

            <p className="text-base text-neutral-300 leading-relaxed">
              Founded in 2024, Next Level Gaming Cafe was born out of a simple frustration: public gaming lounges that cut corners on monitors, keyboards, network stability, and comfort.
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed">
              We built an esports lounge that rivals the training facilities of Tier 1 competitive teams. Whether you are grinding rank with your five-stack, challenging your crew on PlayStation 5, or setting lap times on our direct-drive sim rigs, you get frictionless high-fidelity performance from the moment you take your seat.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
              >
                <span>Experience Next Level</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Pillars Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-purple-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-bold uppercase text-white mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cafe Hardware Specifications Sheet */}
        <div className="rounded-2xl border border-neutral-800 bg-[#0a0a14] p-8">
          <div className="max-w-xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Verified Technical Benchmarks
            </span>
            <h3 className="font-display text-2xl font-bold uppercase text-white mt-1">
              Standard Hardware Baseline
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Tier</th>
                  <th className="py-3 px-4 font-semibold">Processor</th>
                  <th className="py-3 px-4 font-semibold">Graphics</th>
                  <th className="py-3 px-4 font-semibold">Display</th>
                  <th className="py-3 px-4 font-semibold">Network Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Main Floor PC</td>
                  <td className="py-3.5 px-4">Intel Core i9-14900KF</td>
                  <td className="py-3.5 px-4 text-purple-400 font-semibold">RTX 4080 Super 16GB</td>
                  <td className="py-3.5 px-4">360Hz 27" Fast-IPS / OLED</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 tabular-nums">&lt; 3ms Local LAN</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">VIP Squad Suite</td>
                  <td className="py-3.5 px-4">Intel Core i9-14900KS Liquid</td>
                  <td className="py-3.5 px-4 text-purple-400 font-semibold">RTX 4090 24GB Flagship</td>
                  <td className="py-3.5 px-4">240Hz 4K OLED + 75" Replay</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 tabular-nums">&lt; 1ms Dedicated VLAN</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Console Lounge</td>
                  <td className="py-3.5 px-4">Custom AMD Zen 2</td>
                  <td className="py-3.5 px-4 text-cyan-400 font-semibold">PS5 RDNA 2 GPU</td>
                  <td className="py-3.5 px-4">65" LG C3 4K 120Hz OLED</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 tabular-nums">Direct Gigabit Ethernet</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-white">Sim Racing Cockpit</td>
                  <td className="py-3.5 px-4">AMD Ryzen 7 7800X3D</td>
                  <td className="py-3.5 px-4 text-purple-400 font-semibold">RTX 4080 Super 16GB</td>
                  <td className="py-3.5 px-4">Triple 32" Curved 165Hz Array</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 tabular-nums">Direct-Drive Telemetry Bus</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
