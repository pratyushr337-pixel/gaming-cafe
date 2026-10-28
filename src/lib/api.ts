import { GamingStation, Booking, PricePackage, Tournament, ContactMessage } from '../types';
import { INITIAL_STATIONS, INITIAL_PACKAGES, INITIAL_BOOKINGS, UPCOMING_TOURNAMENTS } from '../data/initialData';

const STORAGE_KEYS = {
  STATIONS: 'nl_stations_cache',
  PACKAGES: 'nl_packages_cache',
  BOOKINGS: 'nl_bookings_cache',
  TOURNAMENTS: 'nl_tournaments_cache',
  ADMIN_TOKEN: 'nl_admin_token',
};

// Initialize localStorage fallback cache if empty
function initFallbackStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(INITIAL_STATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_PACKAGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TOURNAMENTS)) {
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(UPCOMING_TOURNAMENTS));
  }
}

export async function fetchStations(): Promise<GamingStation[]> {
  try {
    const res = await fetch('/api/stations');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(data.stations));
      return data.stations;
    }
  } catch (err) {
    console.warn('API offline, using local fallback:', err);
  }
  initFallbackStorage();
  const cached = localStorage.getItem(STORAGE_KEYS.STATIONS);
  return cached ? JSON.parse(cached) : INITIAL_STATIONS;
}

export async function updateStation(id: string, updates: Partial<GamingStation>): Promise<GamingStation> {
  try {
    const res = await fetch(`/api/stations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      return data.station;
    }
  } catch (err) {
    console.warn('API offline, saving locally:', err);
  }
  // Local fallback
  initFallbackStorage();
  const stations: GamingStation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATIONS) || '[]');
  const idx = stations.findIndex((s) => s.id === id);
  if (idx !== -1) {
    stations[idx] = { ...stations[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(stations));
    return stations[idx];
  }
  throw new Error('Station not found');
}

export async function fetchPackages(): Promise<PricePackage[]> {
  try {
    const res = await fetch('/api/pricing');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(data.packages));
      return data.packages;
    }
  } catch (err) {
    console.warn('API offline, using local fallback:', err);
  }
  initFallbackStorage();
  const cached = localStorage.getItem(STORAGE_KEYS.PACKAGES);
  return cached ? JSON.parse(cached) : INITIAL_PACKAGES;
}

export async function updatePackage(id: string, updates: Partial<PricePackage>): Promise<PricePackage> {
  try {
    const res = await fetch(`/api/pricing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      return data.package;
    }
  } catch (err) {
    console.warn('API offline, updating locally:', err);
  }
  initFallbackStorage();
  const pkgs: PricePackage[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PACKAGES) || '[]');
  const idx = pkgs.findIndex((p) => p.id === id);
  if (idx !== -1) {
    pkgs[idx] = { ...pkgs[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(pkgs));
    return pkgs[idx];
  }
  throw new Error('Package not found');
}

export async function checkSlotAvailability(stationId: string, date: string, startTime: string, durationHours: number) {
  try {
    const res = await fetch('/api/bookings/check-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stationId, date, startTime, durationHours }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('API offline, checking locally:', err);
  }
  // Fallback calculation
  initFallbackStorage();
  const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const stations: GamingStation[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATIONS) || '[]');
  const station = stations.find((s) => s.id === stationId);
  const total = station ? station.totalUnits : 10;

  const [startH, startM] = startTime.split(':').map(Number);
  const reqStart = (startH || 0) + (startM || 0) / 60;
  const reqEnd = reqStart + durationHours;

  const overlapping = bookings.filter((b) => {
    if (b.stationId !== stationId || b.date !== date || b.status === 'cancelled') return false;
    const [bH, bM] = b.startTime.split(':').map(Number);
    const bStart = (bH || 0) + (bM || 0) / 60;
    const bEnd = bStart + b.durationHours;
    return Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd);
  });

  const freeUnits = Math.max(0, total - overlapping.length);
  return {
    available: freeUnits > 0,
    occupiedUnits: overlapping.length,
    freeUnits,
    totalUnits: total,
  };
}

export async function fetchBookings(filter?: { status?: string; isDemo?: boolean }): Promise<Booking[]> {
  try {
    let url = '/api/bookings';
    if (filter?.status) url += `?status=${filter.status}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(data.bookings));
      return data.bookings;
    }
  } catch (err) {
    console.warn('API offline, using local fallback:', err);
  }
  initFallbackStorage();
  const list: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  if (filter?.status && filter.status !== 'all') {
    return list.filter((b) => b.status === filter.status);
  }
  return list;
}

export async function createBooking(payload: {
  stationId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  discordTag?: string;
  date: string;
  startTime: string;
  durationHours: number;
  isDemo: boolean;
  specialRequests?: string;
  selectedPackage?: string;
  snackAddons?: string[];
}): Promise<Booking> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      // update local
      const current = await fetchBookings();
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([data.booking, ...current]));
      return data.booking;
    } else {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to submit booking');
    }
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }

  // Fallback creation
  initFallbackStorage();
  const stations = await fetchStations();
  const station = stations.find((s) => s.id === payload.stationId);
  const dur = payload.durationHours;
  let totalPrice = (station ? station.hourlyRate : 10) * dur;
  if (dur >= 8) totalPrice = Math.round(totalPrice * 0.75);
  else if (dur >= 3) totalPrice = Math.round(totalPrice * 0.85);

  const newBooking: Booking = {
    id: `NL-${Math.floor(10000 + Math.random() * 90000)}`,
    stationId: payload.stationId,
    stationTitle: station ? station.title : 'Gaming Station',
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    discordTag: payload.discordTag || '',
    date: payload.date,
    startTime: payload.startTime,
    durationHours: dur,
    totalPrice,
    isDemo: Boolean(payload.isDemo),
    status: payload.isDemo ? 'pending' : 'confirmed',
    specialRequests: payload.specialRequests || '',
    selectedPackage: payload.selectedPackage || `${dur} Hour(s) Session`,
    snackAddons: payload.snackAddons || [],
    createdAt: new Date().toISOString(),
  };

  const current: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  current.unshift(newBooking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(current));
  return newBooking;
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
  try {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.booking;
    }
  } catch (err) {
    console.warn('API offline, updating status locally:', err);
  }
  initFallbackStorage();
  const bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  const item = bookings.find((b) => b.id === id);
  if (item) {
    item.status = status;
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return item;
  }
  throw new Error('Booking not found');
}

export async function deleteBooking(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) return true;
  } catch (err) {
    console.warn('API offline, removing locally:', err);
  }
  initFallbackStorage();
  let bookings: Booking[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  bookings = bookings.filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  return true;
}

export async function fetchTournaments(): Promise<Tournament[]> {
  try {
    const res = await fetch('/api/tournaments');
    if (res.ok) {
      const data = await res.json();
      return data.tournaments;
    }
  } catch (err) {
    console.warn('API offline, using tournaments cache:', err);
  }
  initFallbackStorage();
  const cached = localStorage.getItem(STORAGE_KEYS.TOURNAMENTS);
  return cached ? JSON.parse(cached) : UPCOMING_TOURNAMENTS;
}

export async function registerTournament(
  tournamentId: string,
  registrationData: { teamName: string; captainName: string; email: string; phone: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });
    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json();
    throw new Error(errData.error || 'Failed to register');
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }
  // Local fallback
  initFallbackStorage();
  const tournaments: Tournament[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TOURNAMENTS) || '[]');
  const tourney = tournaments.find((t) => t.id === tournamentId);
  if (tourney) {
    tourney.registeredCount = Math.min(tourney.maxTeams, tourney.registeredCount + 1);
    localStorage.setItem(STORAGE_KEYS.TOURNAMENTS, JSON.stringify(tournaments));
    return {
      success: true,
      message: `Team "${registrationData.teamName || registrationData.captainName}" successfully registered!`,
    };
  }
  throw new Error('Tournament not found');
}

export async function submitContact(message: { name: string; email: string; phone?: string; subject?: string; message: string }) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Contact fallback:', err);
  }
  return { success: true, message: 'Message recorded! We will get back to you within 2 hours.' };
}

export async function adminLogin(password: string) {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, data.token);
      return data;
    }
    const err = await res.json();
    throw new Error(err.error || 'Invalid credentials');
  } catch (err: any) {
    if (err.message && !err.message.includes('Failed to fetch')) {
      throw err;
    }
  }
  // Local fallback password check
  if (password === 'nextlevel2026' || password === 'admin') {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'nl-admin-session-valid-token');
    return {
      success: true,
      token: 'nl-admin-session-valid-token',
      role: 'owner',
      name: 'Cafe General Manager',
    };
  }
  throw new Error('Invalid passkey. Use nextlevel2026 or admin');
}

export async function fetchAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Admin stats fallback:', err);
  }
  const bookings: Booking[] = await fetchBookings();
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  return {
    totalBookings: bookings.length,
    confirmedBookings: confirmed.length,
    pendingRequests: bookings.filter((b) => b.status === 'pending').length,
    totalRevenue: confirmed.reduce((sum, b) => sum + b.totalPrice, 0),
    totalHours: confirmed.reduce((sum, b) => sum + b.durationHours, 0),
    totalStations: 48,
  };
}
