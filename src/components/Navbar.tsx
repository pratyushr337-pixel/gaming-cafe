import { useState } from 'react';
import { Gamepad2, Menu, X, Shield, CalendarCheck } from 'lucide-react';

interface NavbarProps {
  onOpenBooking: (stationId?: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export default function Navbar({ onOpenBooking, onOpenAdmin, isAdminLoggedIn }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Stations', href: '#stations' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Games', href: '#games' },
    { label: 'Tournaments', href: '#tournaments' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Location', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-[#07070cd9] backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title, single line */}
        <a href="#" className="flex items-center gap-3 whitespace-nowrap shrink-0 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-black tracking-wider text-white group-hover:text-purple-300 transition-colors uppercase">
              NEXT LEVEL
            </span>
            <span className="text-[10px] tracking-[0.25em] text-cyan-400 uppercase font-semibold">
              GAMING CAFE
            </span>
          </div>
        </a>

        {/* Zone 2: 4-7 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + Admin shortcut */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            title={isAdminLoggedIn ? 'Admin Portal (Logged In)' : 'Staff & Owner Portal'}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isAdminLoggedIn
                ? 'bg-purple-950/60 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>{isAdminLoggedIn ? 'Admin Hub' : 'Staff Login'}</span>
          </button>

          <button
            onClick={() => onOpenBooking()}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-lg hover:opacity-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Book Session</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => onOpenBooking()}
            className="px-3 py-1.5 text-xs font-bold uppercase text-white bg-purple-600 rounded-md"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-800/80 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-800 bg-[#090912] px-6 py-5 shadow-2xl space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-cyan-400 hover:bg-neutral-800/50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg"
            >
              Book Your Session Now
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-center text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center gap-2"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>{isAdminLoggedIn ? 'Open Admin Hub' : 'Staff / Owner Portal'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
