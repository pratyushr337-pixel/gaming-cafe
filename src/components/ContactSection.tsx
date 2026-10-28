import { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  Send,
  ExternalLink,
  CheckCircle2,
  Instagram,
  Youtube,
  Tv,
} from 'lucide-react';
import { CAFE_INFO } from '../data/initialData';
import { submitContact } from '../lib/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Question',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await submitContact(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Question',
        message: '',
      });
    } catch (err: any) {
      setErrorMsg('Failed to send message. Please try WhatsApp or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 border-b border-neutral-800 bg-[#070710]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
            <span>Get in Touch</span>
            <span aria-hidden="true">·</span>
            <span>Visit the Cafe</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            CONTACT & LOCATION
          </h2>
          <p className="mt-3 text-neutral-400 text-base leading-relaxed">
            Have questions about party packages, tournament registrations, or customized corporate LAN events? Reach out directly or drop by the arena.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Business Info & Hours & Socials */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address Box */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                  <MapPin className="h-4 w-4" />
                  <span>Arena Address</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                  {CAFE_INFO.address}
                </p>
                <a
                  href={CAFE_INFO.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold pt-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Hours Box */}
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <Clock className="h-4 w-4" />
                  <span>Operating Hours</span>
                </div>
                <div className="text-xs text-neutral-300 space-y-1">
                  <div>{CAFE_INFO.hours.weekdays}</div>
                  <div className="text-purple-300 font-medium">{CAFE_INFO.hours.weekends}</div>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons: WhatsApp & Phone */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-[#0d0d18] to-neutral-900 border border-neutral-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                Instant Chat & Direct Booking Line
              </span>
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <a
                  href={`https://wa.me/${CAFE_INFO.whatsapp}?text=Hi%20Next%20Level%20Gaming%20Cafe%2C%20I%20would%20like%20to%20inquire%20about%20a%20gaming%20session%20or%20event.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`tel:${CAFE_INFO.phone}`}
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider border border-neutral-700 transition-all"
                >
                  <Phone className="h-4 w-4 text-cyan-400" />
                  <span>Call {CAFE_INFO.phone}</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive Map */}
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <iframe
                title="Next Level Gaming Cafe Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12090.725807963327!2d-73.99307779999999!3d40.758896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(120%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-400">Join Community:</span>
              <div className="flex items-center gap-2">
                <a
                  href={CAFE_INFO.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900 hover:bg-purple-950/60 border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={CAFE_INFO.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900 hover:bg-rose-950/60 border border-neutral-800 hover:border-rose-500/50 text-neutral-300 hover:text-white transition-all"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href={CAFE_INFO.socials.twitch}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg bg-neutral-900 hover:bg-purple-950/60 border border-neutral-800 hover:border-purple-500/50 text-neutral-300 hover:text-white transition-all"
                  aria-label="Twitch"
                >
                  <Tv className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Inquiries Form */}
          <div className="p-8 rounded-2xl border border-neutral-800 bg-[#0a0a14]">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold uppercase text-white">
                Send a Message
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                We respond to all online inquiries within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-display text-xl font-bold uppercase text-white">
                  Message Dispatched!
                </h4>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto">
                  Thank you for reaching out. Our cafe shift manager has received your note and will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="jordan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Birthday / Squad LAN Party Booking">Birthday / Squad LAN Party Booking</option>
                    <option value="Esports Team Boot Camp / VIP Suite">Esports Team Boot Camp / VIP Suite</option>
                    <option value="Tournament Sponsorship / Partnership">Tournament Sponsorship / Partnership</option>
                    <option value="Hardware / Setup Inquiries">Hardware / Setup Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us what dates, stations, or special requests you have in mind..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Send Inquiry Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
