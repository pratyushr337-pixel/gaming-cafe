import { Gamepad2, Shield, Heart } from 'lucide-react';
import { CAFE_INFO } from '../data/initialData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export default function Footer({ onOpenBooking, onOpenAdmin, isAdminLoggedIn }: FooterProps) {
  return (
    <footer className="border-t border-neutral-800 bg-[#040407] text-neutral-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
                <Gamepad2 className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-black uppercase tracking-wider text-white">
                NEXT LEVEL
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Premier esports lounge & cyber gaming sanctuary. Liquid-cooled RTX 4090 battlestations, 360Hz displays, PS5 suites, and direct-drive sim racing.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
              >
                Book A Session
              </button>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#stations" className="hover:text-cyan-400 transition-colors">
                  Gaming Stations & Specs
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                  Session Passes & Rates
                </a>
              </li>
              <li>
                <a href="#games" className="hover:text-cyan-400 transition-colors">
                  Pre-Installed Game Library
                </a>
              </li>
              <li>
                <a href="#tournaments" className="hover:text-cyan-400 transition-colors">
                  Upcoming LAN Tournaments
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-cyan-400 transition-colors">
                  Arena & Rig Gallery
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">
                  Hardware Philosophy
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Hours & Location
            </h4>
            <div className="space-y-2 text-neutral-400">
              <p>{CAFE_INFO.address}</p>
              <p className="text-neutral-300 font-medium">Mon - Thu: 10:00 AM - 1:00 AM</p>
              <p className="text-purple-300 font-medium">Fri - Sun: 10:00 AM - 4:00 AM (24h LAN)</p>
              <p>Phone: {CAFE_INFO.phone}</p>
            </div>
          </div>

          {/* Staff & Admin Section */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">
              Operations & Staff
            </h4>
            <p className="text-xs text-neutral-400">
              Authorized personnel and shift management access.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                  isAdminLoggedIn
                    ? 'bg-purple-950/70 text-purple-300 border-purple-500/50 shadow-sm'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:text-white hover:border-neutral-700'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>{isAdminLoggedIn ? 'Open Admin Hub' : 'Staff Login'}</span>
              </button>
            </div>
            <div className="text-[11px] text-neutral-500 pt-1">
              Test passcode: <code className="text-neutral-400 font-mono">admin</code>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400">
          <div>
            © {new Date().getFullYear()} Next Level Gaming Cafe LLC. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>House LAN Rules</span>
            <span>Fair Play Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
