import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StationsSection from './components/StationsSection';
import StationDetailModal from './components/StationDetailModal';
import PricingSection from './components/PricingSection';
import BookingModal from './components/BookingModal';
import GamesSection from './components/GamesSection';
import TournamentRegisterModal from './components/TournamentRegisterModal';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';

import { GamingStation, PricePackage, Tournament, Booking } from './types';
import { fetchStations, fetchPackages, fetchTournaments } from './lib/api';

export default function App() {
  const [stations, setStations] = useState<GamingStation[]>([]);
  const [packages, setPackages] = useState<PricePackage[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedStationIdForBooking, setSelectedStationIdForBooking] = useState<string | undefined>();
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<PricePackage | null>(null);

  const [specModalStation, setSpecModalStation] = useState<GamingStation | null>(null);
  const [tournamentModalItem, setTournamentModalItem] = useState<Tournament | null>(null);

  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loadData = async () => {
    try {
      const [sList, pList, tList] = await Promise.all([
        fetchStations(),
        fetchPackages(),
        fetchTournaments(),
      ]);
      setStations(sList);
      setPackages(pList);
      setTournaments(tList);
    } catch (err) {
      console.error('Failed to load initial cafe data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Check if token exists
    if (typeof window !== 'undefined' && localStorage.getItem('nl_admin_token')) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleOpenBooking = (stationId?: string) => {
    setSelectedStationIdForBooking(stationId);
    setSelectedPackageForBooking(null);
    setBookingModalOpen(true);
  };

  const handleSelectPackage = (pkg: PricePackage) => {
    setSelectedPackageForBooking(pkg);
    setSelectedStationIdForBooking(undefined);
    setBookingModalOpen(true);
  };

  const handleExploreSetup = () => {
    const el = document.getElementById('stations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminAction = () => {
    if (isAdminLoggedIn) {
      setAdminDashboardOpen(true);
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nl_admin_token');
    setIsAdminLoggedIn(false);
    setAdminDashboardOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-neutral-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={handleAdminAction}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreSetup={handleExploreSetup}
        />

        {/* Gaming Stations Showcase */}
        <StationsSection
          stations={stations}
          onSelectStation={(id) => handleOpenBooking(id)}
          onViewSpecs={(station) => setSpecModalStation(station)}
        />

        {/* Pricing & Memberships */}
        <PricingSection
          packages={packages}
          onSelectPackage={handleSelectPackage}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Popular Games, Tournaments & Community Leaderboards */}
        <GamesSection
          tournaments={tournaments}
          onRegisterTournament={(t) => setTournamentModalItem(t)}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* About Us & Technical Architecture */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* Atmosphere Photo Gallery with Lightbox */}
        <GallerySection />

        {/* Contact, Location & Hours */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={handleAdminAction}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        stations={stations}
        initialStationId={selectedStationIdForBooking}
        selectedPackage={selectedPackageForBooking}
        onBookingComplete={() => {
          loadData();
        }}
      />

      {/* Hardware Specs Detail Modal */}
      <StationDetailModal
        station={specModalStation}
        onClose={() => setSpecModalStation(null)}
        onBook={(stationId) => handleOpenBooking(stationId)}
      />

      {/* Tournament Registration Modal */}
      <TournamentRegisterModal
        tournament={tournamentModalItem}
        onClose={() => setTournamentModalItem(null)}
        onSuccess={(updated) => {
          setTournaments((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
        }}
      />

      {/* Staff Passcode Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setAdminDashboardOpen(true);
        }}
      />

      {/* Operations & Owner Admin Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        onLogout={handleLogout}
        onDataChanged={loadData}
      />
    </div>
  );
}
