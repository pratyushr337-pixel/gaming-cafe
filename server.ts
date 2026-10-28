import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// In-memory data store with initial cafe state
let stations = [
  {
    id: 'pc-gaming',
    type: 'pc',
    title: 'PC Gaming Battlestation',
    tagline: 'Esports grade performance with RTX 4080 Super & 360Hz displays',
    description: 'Engineered for competitive esports titles. Liquid-cooled powerhouse rigs paired with rapid-trigger mechanical keyboards, ultralight wireless mice, and 1 Gbps symmetric fiber connection.',
    hourlyRate: 8,
    featured: true,
    image: '/src/assets/images/pc_gaming_station_1793164565164.jpg',
    specs: [
      { label: 'GPU', value: 'NVIDIA GeForce RTX 4080 Super 16GB' },
      { label: 'CPU', value: 'Intel Core i9-14900KF Liquid Cooled' },
      { label: 'Display', value: '27" Asus ROG Swift 360Hz 0.03ms OLED' },
      { label: 'RAM', value: '32GB DDR5 6000MHz' },
      { label: 'Peripherals', value: 'SteelSeries Apex Pro & Logitech G Pro X' },
      { label: 'Seating', value: 'Secretlab Titan Evo 2024 Ergonomic' },
    ],
    features: [
      'RTX 4080 Super 16GB Graphics',
      '360Hz Ultra-Low Latency OLED Display',
      'Rapid-trigger magnetic optical keyboard',
      '1 Gbps low-ping dedicated LAN fiber',
      'Discord tournament audio mixamps',
    ],
    totalUnits: 30,
    availableUnits: 24,
    popularGames: ['Valorant', 'Counter-Strike 2', 'Apex Legends', 'League of Legends'],
  },
  {
    id: 'ps5-console',
    type: 'ps5',
    title: 'PlayStation 5 Console Lounge',
    tagline: 'Immersive 4K 120Hz OLED couch gaming & multiplayer showdowns',
    description: 'Relax in plush acoustic booths equipped with PlayStation 5 consoles, ultra-crisp 65-inch LG OLED displays, DualSense wireless controllers, and a full catalog of sports, fighting, and co-op titles.',
    hourlyRate: 10,
    featured: false,
    image: '/src/assets/images/ps5_console_station_1793164566019.jpg',
    specs: [
      { label: 'Platform', value: 'PlayStation 5 Disc Edition (1TB NVMe)' },
      { label: 'Screen', value: '65" LG C3 4K 120Hz OLED TV' },
      { label: 'Audio', value: 'Dolby Atmos Soundbar & Pulse 3D Headsets' },
      { label: 'Controllers', value: '4x DualSense Wireless Haptic Gamepads' },
      { label: 'Seating', value: 'Custom velvet modular lounge booth' },
    ],
    features: [
      '4K 120Hz HDR OLED visual fidelity',
      'Up to 4-player couch co-op & party play',
      'Full PS Plus Deluxe catalog with 200+ games',
      'DualSense edge controllers available',
      'In-booth food & beverage service',
    ],
    totalUnits: 12,
    availableUnits: 9,
    popularGames: ['EA SPORTS FC 25', 'Tekken 8', 'Spider-Man 2', 'NBA 2K25'],
  },
  {
    id: 'racing-sim',
    type: 'racing',
    title: 'Sim Racing Pro Cockpit',
    tagline: 'Direct-drive force feedback & hydraulic load-cell realism',
    description: 'Feel every curb, drift, and gear shift. Full aluminum profile racing rig with Moza direct-drive wheel bases, hydraulic load-cell brake pedals, and triple wrap-around panoramic screens.',
    hourlyRate: 15,
    featured: true,
    image: '/src/assets/images/racing_simulator_1793164566642.jpg',
    specs: [
      { label: 'Wheelbase', value: 'Direct-Drive 16Nm Force Feedback' },
      { label: 'Wheel', value: 'Alcantara Formula & GT Quick-Release Rims' },
      { label: 'Pedals', value: 'Heusinkveld Load-Cell Hydraulic Pedals' },
      { label: 'Display', value: 'Triple 32" 165Hz Curved Surround Array' },
      { label: 'Chassis', value: 'Rigid Aluminum Sim Rig with Sparco Seat' },
      { label: 'Tactile', value: 'Dual haptic bass shakers for chassis rumble' },
    ],
    features: [
      '16Nm direct-drive wheel with real telemetry',
      'Triple curved screens for true 180° field of view',
      'Authentic F1, GT3, and rally paddle shifters',
      'Pre-calibrated force feedback presets',
      'Leaderboard hot-lap telemetry tracking',
    ],
    totalUnits: 4,
    availableUnits: 3,
    popularGames: ['Assetto Corsa Competizione', 'F1 24', 'Forza Horizon 5', 'iRacing'],
  },
  {
    id: 'vip-room',
    type: 'vip',
    title: 'VIP Esports Squad Suite',
    tagline: 'Private soundproof team room for 5 players with personal lounge',
    description: 'The definitive pro esports experience. Private soundproof suite featuring 5 synchronized flagship RTX 4090 battlestations, a 75" strategy analysis display, leather lounge seating, and private fridge.',
    hourlyRate: 45,
    featured: true,
    image: '/src/assets/images/vip_gaming_room_1793164565655.jpg',
    specs: [
      { label: 'Rigs', value: '5x NVIDIA RTX 4090 24GB Flagship Battlestations' },
      { label: 'Displays', value: '5x 240Hz OLED + 75" Sony Bravia 4K TV' },
      { label: 'Acoustics', value: 'Full acoustic sound dampening & private entry' },
      { label: 'Amenities', value: 'Stocked minibar, leather sofa, private barista' },
      { label: 'Network', value: 'Dedicated unthrottled VLAN with zero jitter' },
    ],
    features: [
      'Exclusive private soundproof room for 5 gamers',
      'Top-tier RTX 4090 liquid-cooled rigs',
      '75" 4K strategy coach replay display',
      'Complimentary energy drinks and snacks included',
      'Dedicated host & rapid equipment assistance',
    ],
    totalUnits: 2,
    availableUnits: 1,
    popularGames: ['Valorant', 'CS2', 'Rainbow Six Siege', 'Dota 2'],
  },
];

let packages = [
  {
    id: 'pkg-hourly',
    name: 'Quick Drop',
    description: 'Perfect for quick ranked matches, daily quests, or lunchtime sessions.',
    durationLabel: '1 Hour Play',
    hours: 1,
    stationType: 'pc',
    regularPrice: 8,
    features: ['Full access to chosen station', 'Instant game library access', '1 Gbps gigabit fiber ping', 'Peripherals included'],
  },
  {
    id: 'pkg-3hr',
    name: 'Power Session',
    description: 'Our most popular session. Ideal for climbing competitive tiers with friends.',
    durationLabel: '3 Hours Consecutive',
    hours: 3,
    stationType: 'all',
    regularPrice: 24,
    discountPrice: 20,
    savingsBadge: 'Save 17%',
    isPopular: true,
    features: ['3 hours unthrottled gaming time', 'Complimentary chilled soda / mineral water', 'Priority seat selection', 'Session extension at discount rate'],
  },
  {
    id: 'pkg-allday',
    name: 'Day Grinder Pass',
    description: 'Marathon gaming day. Play all day long from open to close.',
    durationLabel: 'Full Day (8 Hours)',
    hours: 8,
    stationType: 'all',
    regularPrice: 64,
    discountPrice: 48,
    savingsBadge: 'Save 25%',
    features: ['8 full hours of session time', '1x Cafe burger / loaded fries combo included', 'Free Monster Energy drink', 'Switch between PC and PS5 anytime', 'Re-entry allowed during session'],
  },
  {
    id: 'pkg-midnight',
    name: 'Night Owl LAN Pass',
    description: 'Exclusive after-hours gaming session from 11:00 PM to 6:00 AM.',
    durationLabel: 'Overnight (7 Hours)',
    hours: 7,
    stationType: 'pc',
    regularPrice: 56,
    discountPrice: 38,
    savingsBadge: 'Best Value',
    features: ['Overnight 11 PM - 6 AM session', 'Unlimited filter coffee & hot cocoa', 'Late night community tournaments', 'Chill ambient lighting & lofi music'],
  },
];

let bookings = [
  {
    id: 'NL-80412',
    stationId: 'pc-gaming',
    stationTitle: 'PC Gaming Battlestation',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.v@example.com',
    customerPhone: '+1 (555) 349-8812',
    discordTag: 'Vance#4090',
    date: '2026-10-28',
    startTime: '16:00',
    durationHours: 3,
    totalPrice: 20,
    isDemo: false,
    status: 'confirmed',
    selectedPackage: 'Power Session (3h)',
    createdAt: '2026-10-27T18:20:00.000Z',
  },
  {
    id: 'NL-80413',
    stationId: 'vip-room',
    stationTitle: 'VIP Esports Squad Suite',
    customerName: 'Team Eclipse (Capt. Liam)',
    customerEmail: 'liam.eclipse@esports.gg',
    customerPhone: '+1 (555) 912-4450',
    discordTag: 'LiamEclipse#0001',
    date: '2026-10-28',
    startTime: '18:00',
    durationHours: 4,
    totalPrice: 180,
    isDemo: false,
    status: 'confirmed',
    specialRequests: 'Tournament scrim preparation. 5 Monster energy drinks requested.',
    createdAt: '2026-10-27T19:40:00.000Z',
  },
  {
    id: 'NL-80414',
    stationId: 'racing-sim',
    stationTitle: 'Sim Racing Pro Cockpit',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@telemetry.io',
    customerPhone: '+1 (555) 234-9911',
    discordTag: 'SpeedyElena',
    date: '2026-10-29',
    startTime: '14:00',
    durationHours: 2,
    totalPrice: 30,
    isDemo: true,
    status: 'pending',
    createdAt: '2026-10-27T21:10:00.000Z',
  },
];

let tournaments = [
  {
    id: 'tourn-val-1',
    title: 'Valorant 5v5 Apex Championship',
    game: 'Valorant',
    format: '5v5 Double Elimination (Custom Lobby)',
    date: 'Saturday, Nov 07, 2026',
    time: '1:00 PM EST',
    prizePool: '$1,500 Cash + Trophies',
    entryFee: '$50 per team (Includes LAN time)',
    maxTeams: 16,
    registeredCount: 12,
    status: 'open',
    bannerBg: 'from-rose-950/60 to-purple-950/60',
  },
  {
    id: 'tourn-cs2-1',
    title: 'CS2 Friday Night Fragfest',
    game: 'Counter-Strike 2',
    format: '5v5 Single Elimination Bracket',
    date: 'Friday, Nov 13, 2026',
    time: '6:30 PM EST',
    prizePool: '$800 Cash + 20h Passes',
    entryFee: '$35 per team',
    maxTeams: 12,
    registeredCount: 9,
    status: 'open',
    bannerBg: 'from-amber-950/60 to-slate-900/60',
  },
  {
    id: 'tourn-fc25-1',
    title: 'EA SPORTS FC 25 Console Derby',
    game: 'EA SPORTS FC 25',
    format: '1v1 Knockout Stage (PS5)',
    date: 'Sunday, Nov 15, 2026',
    time: '2:00 PM EST',
    prizePool: '$500 Cash + Custom Trophy',
    entryFee: '$15 per player',
    maxTeams: 32,
    registeredCount: 28,
    status: 'filling',
    bannerBg: 'from-emerald-950/60 to-cyan-950/60',
  },
  {
    id: 'tourn-sim-1',
    title: 'Nürburgring GT3 Time Attack',
    game: 'Assetto Corsa',
    format: 'Individual Hot Lap (Sim Cockpit)',
    date: 'Saturday, Nov 21, 2026',
    time: '11:00 AM EST',
    prizePool: '$400 + Thrustmaster Wheel Rim',
    entryFee: '$20 (3 Attempts)',
    maxTeams: 24,
    registeredCount: 16,
    status: 'open',
    bannerBg: 'from-cyan-950/60 to-blue-950/60',
  },
];

let contactMessages: any[] = [];

// Helper to check for overlapping bookings
function checkSlotAvailability(stationId: string, date: string, startTime: string, durationHours: number) {
  const station = stations.find((s) => s.id === stationId);
  if (!station) return { available: false, message: 'Invalid station' };

  // Parse start and end hours
  const [startH, startM] = startTime.split(':').map(Number);
  const reqStart = startH + startM / 60;
  const reqEnd = reqStart + durationHours;

  // Filter overlapping confirmed/pending bookings
  const overlapping = bookings.filter((b) => {
    if (b.stationId !== stationId || b.date !== date || b.status === 'cancelled') return false;
    const [bH, bM] = b.startTime.split(':').map(Number);
    const bStart = bH + bM / 60;
    const bEnd = bStart + b.durationHours;
    return Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd);
  });

  const occupiedUnits = overlapping.length;
  const freeUnits = station.totalUnits - occupiedUnits;

  return {
    available: freeUnits > 0,
    occupiedUnits,
    freeUnits: Math.max(0, freeUnits),
    totalUnits: station.totalUnits,
  };
}

// REST API ROUTES
app.get('/api/stations', (req, res) => {
  res.json({ stations });
});

app.put('/api/stations/:id', (req, res) => {
  const { id } = req.params;
  const idx = stations.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Station not found' });
  }
  stations[idx] = { ...stations[idx], ...req.body };
  res.json({ success: true, station: stations[idx] });
});

app.get('/api/pricing', (req, res) => {
  res.json({ packages });
});

app.put('/api/pricing/:id', (req, res) => {
  const { id } = req.params;
  const idx = packages.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Package not found' });
  }
  packages[idx] = { ...packages[idx], ...req.body };
  res.json({ success: true, package: packages[idx] });
});

app.get('/api/bookings', (req, res) => {
  const { status, date, isDemo } = req.query;
  let filtered = [...bookings];
  if (status && status !== 'all') {
    filtered = filtered.filter((b) => b.status === status);
  }
  if (date) {
    filtered = filtered.filter((b) => b.date === date);
  }
  if (isDemo !== undefined) {
    const isDemoBool = isDemo === 'true';
    filtered = filtered.filter((b) => b.isDemo === isDemoBool);
  }
  // Sort newest first
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ bookings: filtered });
});

app.post('/api/bookings/check-availability', (req, res) => {
  const { stationId, date, startTime, durationHours } = req.body;
  if (!stationId || !date || !startTime || !durationHours) {
    return res.status(400).json({ error: 'Missing required availability parameters' });
  }
  const result = checkSlotAvailability(stationId, date, startTime, Number(durationHours));
  res.json(result);
});

app.post('/api/bookings', (req, res) => {
  const {
    stationId,
    customerName,
    customerEmail,
    customerPhone,
    discordTag,
    date,
    startTime,
    durationHours,
    isDemo,
    specialRequests,
    selectedPackage,
    snackAddons,
  } = req.body;

  if (!stationId || !customerName || !customerEmail || !customerPhone || !date || !startTime || !durationHours) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const station = stations.find((s) => s.id === stationId);
  if (!station) {
    return res.status(404).json({ error: 'Station not found.' });
  }

  // Check collision
  const availability = checkSlotAvailability(stationId, date, startTime, Number(durationHours));
  if (!availability.available) {
    return res.status(409).json({
      error: `No units available for ${station.title} at ${startTime} on ${date}. All ${station.totalUnits} stations are booked.`,
    });
  }

  const dur = Number(durationHours);
  let totalPrice = station.hourlyRate * dur;
  if (dur >= 8) {
    totalPrice = Math.round(totalPrice * 0.75); // 25% full day discount
  } else if (dur >= 3) {
    totalPrice = Math.round(totalPrice * 0.85); // 15% 3h session discount
  }

  const newBooking = {
    id: `NL-${Math.floor(10000 + Math.random() * 90000)}`,
    stationId,
    stationTitle: station.title,
    customerName,
    customerEmail,
    customerPhone,
    discordTag: discordTag || '',
    date,
    startTime,
    durationHours: dur,
    totalPrice,
    isDemo: Boolean(isDemo),
    status: isDemo ? 'pending' : 'confirmed',
    specialRequests: specialRequests || '',
    selectedPackage: selectedPackage || `${dur} Hour(s) Session`,
    snackAddons: snackAddons || [],
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = bookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  booking.status = status;
  res.json({ success: true, booking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = bookings.length;
  bookings = bookings.filter((b) => b.id !== id);
  if (bookings.length === initialLength) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json({ success: true, message: 'Reservation removed' });
});

app.get('/api/tournaments', (req, res) => {
  res.json({ tournaments });
});

app.post('/api/tournaments/:id/register', (req, res) => {
  const { id } = req.params;
  const { teamName, captainName, email, phone, members } = req.body;
  const tourney = tournaments.find((t) => t.id === id);
  if (!tourney) {
    return res.status(404).json({ error: 'Tournament not found' });
  }
  if (tourney.registeredCount >= tourney.maxTeams) {
    return res.status(400).json({ error: 'Tournament bracket is full.' });
  }
  tourney.registeredCount += 1;
  res.json({
    success: true,
    message: `Team "${teamName || captainName}" registered successfully for ${tourney.title}!`,
    tournament: tourney,
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  const msg = {
    id: `MSG-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString(),
  };
  contactMessages.unshift(msg);
  res.json({ success: true, message: 'Your message has been sent to our team. We will reach out shortly!' });
});

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  // Default password for owner/staff
  if (password === 'nextlevel2026' || password === 'admin') {
    res.json({
      success: true,
      token: 'nl-admin-session-valid-token',
      role: 'owner',
      name: 'Cafe General Manager',
    });
  } else {
    res.status(401).json({ error: 'Invalid admin passkey. Please try again.' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalHours = confirmedBookings.reduce((sum, b) => sum + b.durationHours, 0);
  const pendingRequests = bookings.filter((b) => b.status === 'pending').length;

  res.json({
    totalBookings: bookings.length,
    confirmedBookings: confirmedBookings.length,
    pendingRequests,
    totalRevenue,
    totalHours,
    totalStations: stations.reduce((acc, s) => acc + s.totalUnits, 0),
  });
});

// Dev / Prod serving setup
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Next Level Gaming Cafe] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
