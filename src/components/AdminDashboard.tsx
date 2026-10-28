import { useState, useEffect } from 'react';
import {
  X,
  Shield,
  LogOut,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Edit2,
  Save,
  PlusCircle,
  RefreshCw,
  Cpu,
  Tag,
  Users,
} from 'lucide-react';
import { Booking, GamingStation, PricePackage } from '../types';
import {
  fetchBookings,
  fetchStations,
  fetchPackages,
  updateStation,
  updatePackage,
  updateBookingStatus,
  deleteBooking,
  createBooking,
  fetchAdminStats,
} from '../lib/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onDataChanged: () => void;
}

export default function AdminDashboard({
  isOpen,
  onClose,
  onLogout,
  onDataChanged,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'stations' | 'packages' | 'walkin'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stations, setStations] = useState<GamingStation[]>([]);
  const [packages, setPackages] = useState<PricePackage[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingRequests: 0,
    totalRevenue: 0,
    totalHours: 0,
    totalStations: 48,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'demo'>('all');
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [stationEditRate, setStationEditRate] = useState<number>(0);
  const [successToast, setSuccessToast] = useState('');

  // Walk-in form state
  const [walkin, setWalkin] = useState({
    stationId: 'pc-gaming',
    customerName: '',
    customerPhone: '',
    durationHours: 2,
    notes: 'Walk-in cash customer',
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [bList, sList, pList, stStats] = await Promise.all([
        fetchBookings(),
        fetchStations(),
        fetchPackages(),
        fetchAdminStats(),
      ]);
      setBookings(bList);
      setStations(sList);
      setPackages(pList);
      setStats(stStats);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAll();
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  if (!isOpen) return null;

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.stationTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'demo') return b.isDemo;
    return b.status === statusFilter;
  });

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(id, status);
      showToast(`Reservation #${id} updated to ${status}`);
      loadAll();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to remove reservation #${id}?`)) return;
    try {
      await deleteBooking(id);
      showToast(`Reservation #${id} deleted`);
      loadAll();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleSaveStationRate = async (station: GamingStation) => {
    try {
      await updateStation(station.id, { hourlyRate: Number(stationEditRate) });
      setEditingStationId(null);
      showToast(`Updated ${station.title} base rate to $${stationEditRate}/hr`);
      loadAll();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update station');
    }
  };

  const handleSavePackagePrice = async (pkg: PricePackage, newPrice: number) => {
    try {
      await updatePackage(pkg.id, { discountPrice: newPrice });
      showToast(`Updated ${pkg.name} price to $${newPrice}`);
      loadAll();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to update package');
    }
  };

  const handleCreateWalkin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkin.customerName || !walkin.customerPhone) {
      alert('Please fill out customer name and phone');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const startTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
      await createBooking({
        stationId: walkin.stationId,
        customerName: walkin.customerName,
        customerEmail: 'walkin@nextlevelcafe.com',
        customerPhone: walkin.customerPhone,
        date: today,
        startTime,
        durationHours: Number(walkin.durationHours),
        isDemo: false,
        specialRequests: walkin.notes,
      });

      showToast(`Walk-in customer ${walkin.customerName} seated and recorded!`);
      setWalkin({
        stationId: 'pc-gaming',
        customerName: '',
        customerPhone: '',
        durationHours: 2,
        notes: 'Walk-in cash customer',
      });
      loadAll();
      onDataChanged();
      setActiveTab('bookings');
    } catch (err: any) {
      alert(err.message || 'Failed to seat walk-in');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-2xl border border-neutral-700/80 bg-[#0c0c16] text-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-[#080811] shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                  Next Level Cafe Admin Portal
                </h2>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Live Operations
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">
                Manage live bookings, adjust station pricing, and record walk-ins
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-400 hover:text-rose-300 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2 text-xs font-medium text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-neutral-800 bg-neutral-900/40 shrink-0">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Total Bookings</span>
            <div className="font-display text-2xl font-bold text-white mt-0.5 tabular-nums">
              {stats.totalBookings}
            </div>
            <span className="text-[11px] text-purple-400">
              {stats.confirmedBookings} confirmed / {stats.pendingRequests} pending
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Recorded Revenue</span>
            <div className="font-display text-2xl font-bold text-emerald-400 mt-0.5 tabular-nums">
              ${stats.totalRevenue}
            </div>
            <span className="text-[11px] text-neutral-400">From confirmed sessions</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Booked Hours</span>
            <div className="font-display text-2xl font-bold text-cyan-400 mt-0.5 tabular-nums">
              {stats.totalHours} hrs
            </div>
            <span className="text-[11px] text-neutral-400">Hardware utilization</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-xs text-neutral-400 font-medium">Total Stations</span>
            <div className="font-display text-2xl font-bold text-white mt-0.5 tabular-nums">
              {stats.totalStations} Rigs
            </div>
            <span className="text-[11px] text-emerald-400">All setups operational</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-neutral-800 bg-[#090912] shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'bg-purple-600 text-white shadow-sm border-t border-x border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Manage Reservations ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stations')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'stations'
                ? 'bg-purple-600 text-white shadow-sm border-t border-x border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Station Rates & Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'packages'
                ? 'bg-purple-600 text-white shadow-sm border-t border-x border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            <span>Package Prices</span>
          </button>

          <button
            onClick={() => setActiveTab('walkin')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'walkin'
                ? 'bg-purple-600 text-white shadow-sm border-t border-x border-purple-500'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Record Walk-In Guest</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: RESERVATIONS MANAGER */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search by customer, ID, or station..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Filter:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Bookings</option>
                    <option value="confirmed">Confirmed Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="demo">Demo Bookings Only</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={loadAll}
                    className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800"
                    title="Refresh data"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="rounded-xl border border-neutral-800 bg-[#090912] overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider bg-neutral-900/60">
                      <th className="py-3 px-4 font-semibold">Code / Type</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Station</th>
                      <th className="py-3 px-4 font-semibold">Date & Time</th>
                      <th className="py-3 px-4 font-semibold">Hours</th>
                      <th className="py-3 px-4 font-semibold">Total</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-neutral-500">
                          No matching reservations found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-900/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-mono font-bold text-cyan-300">{b.id}</div>
                            {b.isDemo ? (
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded">
                                DEMO
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                                LIVE
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{b.customerName}</div>
                            <div className="text-[11px] text-neutral-400">{b.customerPhone}</div>
                            {b.discordTag && (
                              <div className="text-[10px] text-purple-400 font-mono">@{b.discordTag}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">{b.stationTitle}</td>
                          <td className="py-3 px-4">
                            <div>{b.date}</div>
                            <div className="text-[11px] text-neutral-400">{b.startTime}</div>
                          </td>
                          <td className="py-3 px-4 font-mono">{b.durationHours} hrs</td>
                          <td className="py-3 px-4 font-display font-bold text-emerald-400 tabular-nums">
                            ${b.totalPrice}
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                              className={`px-2 py-1 text-xs rounded border bg-neutral-900 font-semibold ${
                                b.status === 'confirmed'
                                  ? 'text-emerald-400 border-emerald-500/40'
                                  : b.status === 'pending'
                                  ? 'text-amber-400 border-amber-500/40'
                                  : b.status === 'completed'
                                  ? 'text-cyan-400 border-cyan-500/40'
                                  : 'text-neutral-400 border-neutral-700'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDelete(b.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: STATION RATES & INVENTORY */}
          {activeTab === 'stations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-white">
                    Gaming Station Pricing & Fleet Control
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Cafe owner controls for hourly rates and available units. Changes reflect live on the website.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stations.map((st) => (
                  <div
                    key={st.id}
                    className="p-6 rounded-2xl border border-neutral-800 bg-[#090912] space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                          {st.type.toUpperCase()} SETUP
                        </span>
                        <h4 className="font-display text-xl font-bold uppercase text-white mt-1">
                          {st.title}
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 block">Fleet Units:</span>
                        <span className="font-mono font-bold text-white text-sm">
                          {st.availableUnits} / {st.totalUnits} Ready
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400">{st.tagline}</p>

                    {/* Hourly Rate Editor */}
                    <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-neutral-400 block">Standard Hourly Rate</span>
                        {editingStationId === st.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-white">$</span>
                            <input
                              type="number"
                              value={stationEditRate}
                              onChange={(e) => setStationEditRate(Number(e.target.value))}
                              className="w-20 px-2 py-1 text-sm bg-neutral-950 border border-purple-500 rounded text-white"
                              min={1}
                            />
                            <span className="text-xs text-neutral-400">/ hr</span>
                          </div>
                        ) : (
                          <div className="font-display text-2xl font-black text-white mt-0.5 tabular-nums">
                            ${st.hourlyRate} <span className="text-xs font-normal text-neutral-400">/ hour</span>
                          </div>
                        )}
                      </div>

                      <div>
                        {editingStationId === st.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingStationId(null)}
                              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveStationRate(st)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-lg flex items-center gap-1"
                            >
                              <Save className="h-3.5 w-3.5" />
                              <span>Save</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStationId(st.id);
                              setStationEditRate(st.hourlyRate);
                            }}
                            className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-lg border border-neutral-700 flex items-center gap-1.5"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit Rate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGE PRICING */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-bold uppercase text-white">
                  Special Packages & Discount Passes
                </h3>
                <p className="text-xs text-neutral-400">
                  Update package rates and promotional discount tiers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-6 rounded-2xl border border-neutral-800 bg-[#090912] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display text-xl font-bold uppercase text-white">
                        {pkg.name}
                      </h4>
                      <span className="text-xs text-cyan-400 font-semibold">{pkg.durationLabel}</span>
                    </div>

                    <p className="text-xs text-neutral-400">{pkg.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                      <div>
                        <span className="text-xs text-neutral-400">Session Price:</span>
                        <div className="font-display text-2xl font-black text-emerald-400 tabular-nums">
                          ${pkg.discountPrice ?? pkg.regularPrice}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={pkg.discountPrice ?? pkg.regularPrice}
                          id={`price-input-${pkg.id}`}
                          className="w-20 px-2 py-1 text-sm bg-neutral-900 border border-neutral-700 rounded text-white"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`price-input-${pkg.id}`) as HTMLInputElement;
                            if (input) handleSavePackagePrice(pkg, Number(input.value));
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-500"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MANUAL WALK-IN ENTRY */}
          {activeTab === 'walkin' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  Seat a Walk-In Customer
                </h3>
                <p className="text-xs text-neutral-400">
                  Direct counter registration with immediate station allocation and revenue tracking.
                </p>
              </div>

              <form onSubmit={handleCreateWalkin} className="p-6 rounded-2xl border border-neutral-800 bg-[#090912] space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                    Select Station
                  </label>
                  <select
                    value={walkin.stationId}
                    onChange={(e) => setWalkin({ ...walkin, stationId: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.title} (${st.hourlyRate}/hr) - {st.availableUnits} units free
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sam Rivera"
                      value={walkin.customerName}
                      onChange={(e) => setWalkin({ ...walkin, customerName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={walkin.customerPhone}
                      onChange={(e) => setWalkin({ ...walkin, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                    Duration (Hours)
                  </label>
                  <select
                    value={walkin.durationHours}
                    onChange={(e) => setWalkin({ ...walkin, durationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={1}>1 Hour</option>
                    <option value={2}>2 Hours</option>
                    <option value={3}>3 Hours (Power Session)</option>
                    <option value={4}>4 Hours</option>
                    <option value={8}>8 Hours (Day Grinder)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                    Desk Notes / Seat #
                  </label>
                  <input
                    type="text"
                    value={walkin.notes}
                    onChange={(e) => setWalkin({ ...walkin, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Seat Walk-In Guest & Lock Station</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
