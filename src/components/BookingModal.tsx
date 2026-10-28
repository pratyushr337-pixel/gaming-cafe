import { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  Send,
  MessageCircle,
  FileCheck,
} from 'lucide-react';
import { GamingStation, PricePackage, Booking } from '../types';
import { checkSlotAvailability, createBooking } from '../lib/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stations: GamingStation[];
  initialStationId?: string;
  selectedPackage?: PricePackage | null;
  onBookingComplete?: (booking: Booking) => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  stations,
  initialStationId,
  selectedPackage,
  onBookingComplete,
}: BookingModalProps) {
  // Form state
  const [stationId, setStationId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('14:00');
  const [durationHours, setDurationHours] = useState<number>(3);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [discordTag, setDiscordTag] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  // Availability & Submission State
  const [checkingSlot, setCheckingSlot] = useState<boolean>(false);
  const [slotStatus, setSlotStatus] = useState<{
    available: boolean;
    freeUnits?: number;
    totalUnits?: number;
    message?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Set defaults on modal open
  useEffect(() => {
    if (isOpen) {
      // Pick tomorrow or today's date
      const today = new Date().toISOString().split('T')[0];
      setDate(today);

      if (initialStationId) {
        setStationId(initialStationId);
      } else if (stations.length > 0 && !stationId) {
        setStationId(stations[0].id);
      }

      if (selectedPackage) {
        setDurationHours(selectedPackage.hours);
        if (selectedPackage.stationType !== 'all') {
          const match = stations.find((s) => s.type === selectedPackage.stationType);
          if (match) setStationId(match.id);
        }
      }
      setConfirmedBooking(null);
      setErrorMsg('');
    }
  }, [isOpen, initialStationId, selectedPackage, stations]);

  // Check collision / availability when station, date, startTime, or duration changes
  useEffect(() => {
    if (!stationId || !date || !startTime || !durationHours) return;

    let isMounted = true;
    setCheckingSlot(true);
    checkSlotAvailability(stationId, date, startTime, durationHours)
      .then((res) => {
        if (!isMounted) return;
        setSlotStatus(res);
        setCheckingSlot(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Availability check failed:', err);
        setCheckingSlot(false);
      });

    return () => {
      isMounted = false;
    };
  }, [stationId, date, startTime, durationHours]);

  if (!isOpen) return null;

  const selectedStation = stations.find((s) => s.id === stationId);
  const baseRate = selectedStation ? selectedStation.hourlyRate : 8;

  // Price calculations
  let subtotal = baseRate * durationHours;
  if (selectedPackage && selectedPackage.hours === durationHours && selectedPackage.discountPrice) {
    subtotal = selectedPackage.discountPrice;
  } else if (durationHours >= 8) {
    subtotal = Math.round(subtotal * 0.75); // 25% full day
  } else if (durationHours >= 3) {
    subtotal = Math.round(subtotal * 0.85); // 15% 3h session
  }

  // Promo code
  const discountAmount = promoApplied ? Math.round(subtotal * 0.2) : 0;
  const totalPrice = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'STUDENT20' || code === 'SQUAD5' || code === 'NEXTLEVEL') {
      setPromoApplied(true);
      setErrorMsg('');
    } else {
      setPromoApplied(false);
      setErrorMsg('Invalid code. Try "STUDENT20" for 20% off.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName || !customerEmail || !customerPhone) {
      setErrorMsg('Please provide your name, email, and phone number.');
      return;
    }

    if (slotStatus && !slotStatus.available) {
      setErrorMsg('This slot is fully booked. Please select a different time or station.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
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
        selectedPackage: selectedPackage ? selectedPackage.name : `${durationHours} Hour Session`,
      });

      setConfirmedBooking(result);
      if (onBookingComplete) onBookingComplete(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-700/80 bg-[#0c0c16] text-white shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-[#080811]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                Book Your Gaming Session
              </h2>
              <p className="text-[11px] text-neutral-400">
                Real-time slot reservation & hardware allocation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body: Confirmation or Booking Form */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {confirmedBooking.isDemo ? 'Demo Reservation Saved' : 'Booking Confirmed & Station Locked'}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                You Are Locked In!
              </h3>
              <p className="text-sm text-neutral-300 max-w-md mx-auto">
                {confirmedBooking.isDemo
                  ? 'Your demo reservation has been recorded in the system. Notice: Demo bookings do not hold real seats at the physical counter.'
                  : `Your reservation code is #${confirmedBooking.id}. Present this at the cafe counter upon check-in.`}
              </p>
            </div>

            {/* Ticket details summary */}
            <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-left space-y-3 text-xs max-w-md mx-auto">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Reservation ID:</span>
                <span className="font-mono font-bold text-cyan-300">{confirmedBooking.id}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Setup:</span>
                <span className="font-semibold text-white">{confirmedBooking.stationTitle}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Date & Time:</span>
                <span className="font-medium text-neutral-200">
                  {confirmedBooking.date} at {confirmedBooking.startTime} ({confirmedBooking.durationHours} hrs)
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Guest:</span>
                <span className="font-medium text-neutral-200">
                  {confirmedBooking.customerName} ({confirmedBooking.customerPhone})
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-400">Total Price:</span>
                <span className="font-display font-bold text-base text-emerald-400 tabular-nums">
                  ${confirmedBooking.totalPrice}
                </span>
              </div>
            </div>

            {/* Actions for Confirmed Booking */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/15557894263?text=Hi%20Next%20Level%20Gaming%20Cafe%2C%20I%20have%20booked%20Reservation%20%23${confirmedBooking.id}%20for%20${confirmedBooking.customerName}%20on%20${confirmedBooking.date}%20at%20${confirmedBooking.startTime}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp Confirmation</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mode Selector: Confirmed vs Demo */}
            <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Reservation Mode
                </span>
                <span className="text-[11px] text-neutral-400">
                  {isDemo
                    ? 'Demo Mode: For simulation & testing without locking a seat'
                    : 'Real Reservation: Officially locks the rig and confirms time slot'}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-lg border border-neutral-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsDemo(false)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    !isDemo
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Live Booking
                </button>
                <button
                  type="button"
                  onClick={() => setIsDemo(true)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    isDemo
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Demo Test
                </button>
              </div>
            </div>

            {/* Station Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                1. Select Gaming Station
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {stations.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStationId(st.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      stationId === st.id
                        ? 'bg-purple-950/50 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <span className="font-display text-xs font-bold uppercase leading-tight line-clamp-1">
                      {st.title}
                    </span>
                    <span className="text-[11px] font-semibold text-cyan-400 mt-2 tabular-nums">
                      ${st.hourlyRate}/hr
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date, Time & Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Start Time</span>
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                >
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t} {Number(t.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Session Length</span>
                </label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={1}>1 Hour (Quick Drop)</option>
                  <option value={2}>2 Hours</option>
                  <option value={3}>3 Hours (Power Session - 15% off)</option>
                  <option value={4}>4 Hours</option>
                  <option value={5}>5 Hours</option>
                  <option value={8}>8 Hours (Full Day Pass - 25% off)</option>
                </select>
              </div>
            </div>

            {/* Live slot collision / availability check display */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Slot Status:</span>
                {checkingSlot ? (
                  <span className="text-neutral-400 animate-pulse">Checking seat availability...</span>
                ) : slotStatus?.available ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Available ({slotStatus.freeUnits} units open for {startTime})</span>
                  </span>
                ) : (
                  <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Slot full. Overlapping bookings detected.</span>
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-500">Live DB Collision Check</span>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
                2. Contact & Gamer Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="tel"
                    placeholder="Phone / WhatsApp Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-bold">#</span>
                  <input
                    type="text"
                    placeholder="Discord Tag (Optional, e.g. Gamer#1234)"
                    value={discordTag}
                    onChange={(e) => setDiscordTag(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Special requests or tournament title (optional)..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Promo Code Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Promo Code (e.g. STUDENT20)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white uppercase placeholder:normal-case placeholder-neutral-500 focus:outline-none focus:border-purple-500 w-48"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                Apply
              </button>
              {promoApplied && (
                <span className="text-xs font-semibold text-emerald-400">20% discount applied!</span>
              )}
            </div>

            {/* Total Calculation & Submit Button */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
                  Calculated Total
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-white tabular-nums">
                    ${totalPrice}
                  </span>
                  {promoApplied && (
                    <span className="text-xs text-neutral-500 line-through tabular-nums">
                      ${subtotal}
                    </span>
                  )}
                  <span className="text-xs text-neutral-400">
                    ({durationHours}h on {selectedStation?.title.split(' ')[0]})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || (slotStatus !== null && !slotStatus.available)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <span>Confirming...</span>
                  ) : (
                    <>
                      <FileCheck className="h-4 w-4" />
                      <span>{isDemo ? 'Save Demo Booking' : 'Lock My Session'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
