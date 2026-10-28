import { useState } from 'react';
import { Check, ShieldCheck, Award, Zap, Tag, CalendarCheck } from 'lucide-react';
import { PricePackage, MembershipPlan } from '../types';
import { INITIAL_MEMBERSHIPS, SPECIAL_OFFERS } from '../data/initialData';

interface PricingSectionProps {
  packages: PricePackage[];
  onSelectPackage: (pkg: PricePackage) => void;
  onOpenBooking: () => void;
}

export default function PricingSection({ packages, onSelectPackage, onOpenBooking }: PricingSectionProps) {
  const [activeTab, setActiveTab] = useState<'packages' | 'memberships' | 'offers'>('packages');

  return (
    <section id="pricing" className="relative py-24 border-b border-neutral-800 bg-[#07070f]">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-purple-900/10 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
            <span>Transparent Rates</span>
            <span aria-hidden="true">·</span>
            <span>No Hidden Surcharges</span>
            <span aria-hidden="true">·</span>
            <span>Owner Configurable</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            PRICING & MEMBERSHIPS
          </h2>
          <p className="mt-3 text-neutral-400 text-base leading-relaxed">
            Drop in for a quick competitive match or lock in an all-day grinder pass. Upgrade to an official membership for priority reservations, free hours, and tournament perks.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'packages'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Session Passes</span>
            </button>

            <button
              onClick={() => setActiveTab('memberships')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'memberships'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Monthly Memberships</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'offers'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Special Offers & Discounts</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Session Passes */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-purple-950/40 to-neutral-900/90 border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.2)] scale-[1.02]'
                    : 'bg-neutral-900/70 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-[10px] font-extrabold uppercase tracking-widest text-white rounded-full shadow-md whitespace-nowrap">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                      {pkg.durationLabel}
                    </span>
                    {pkg.savingsBadge && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {pkg.savingsBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-xl font-bold uppercase text-white mt-2">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2 min-h-[36px] leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Pricing line */}
                  <div className="mt-5 pb-5 border-b border-neutral-800 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-black text-white tabular-nums">
                      ${pkg.discountPrice ?? pkg.regularPrice}
                    </span>
                    {pkg.discountPrice && (
                      <span className="text-sm text-neutral-500 line-through tabular-nums">
                        ${pkg.regularPrice}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">/ session</span>
                  </div>

                  {/* Features list */}
                  <div className="mt-5 space-y-2.5">
                    {pkg.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 ${
                      pkg.isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:opacity-90'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    }`}
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span>Select Package</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Monthly Memberships */}
        {activeTab === 'memberships' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {INITIAL_MEMBERSHIPS.map((mem) => (
              <div
                key={mem.id}
                className={`relative rounded-2xl border p-7 flex flex-col justify-between transition-all ${
                  mem.popular
                    ? 'bg-gradient-to-b from-purple-950/40 via-neutral-900/90 to-[#0a0a14] border-purple-500/70 shadow-[0_0_35px_rgba(168,85,247,0.25)] scale-[1.03]'
                    : 'bg-neutral-900/70 border-neutral-800/90 hover:border-neutral-700'
                }`}
              >
                {mem.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg">
                    Recommended Tier
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">
                      Tier {mem.tier.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                      {mem.allocatedHours} Hours / Mo
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-black uppercase text-white mt-3">
                    {mem.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2 font-medium">
                    {mem.discounts}
                  </p>

                  <div className="mt-6 pb-6 border-b border-neutral-800 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl sm:text-5xl font-black text-white tabular-nums">
                      ${mem.monthlyFee}
                    </span>
                    <span className="text-xs text-neutral-400">/ month billing</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Tier Privileges:
                    </span>
                    {mem.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2.5 text-xs text-neutral-200">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-2">
                  <button
                    onClick={onOpenBooking}
                    className={`w-full py-3 px-4 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      mem.popular
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:opacity-90'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                    }`}
                  >
                    Join {mem.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Special Offers */}
        {activeTab === 'offers' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SPECIAL_OFFERS.map((offer) => (
              <div
                key={offer.title}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 flex flex-col justify-between hover:border-purple-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      Promo Code: <span className="font-mono text-cyan-300">{offer.code}</span>
                    </span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      {offer.discount}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold uppercase text-white">
                    {offer.title}
                  </h3>

                  <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="mt-4 p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 text-[11px] text-neutral-400">
                    <span className="font-semibold text-neutral-300">Applicable: </span>
                    {offer.eligibility}
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="mt-6 w-full py-2.5 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/40 rounded-xl transition-colors"
                >
                  Apply In Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
