import { useState } from 'react';
import { Trophy, Calendar, Users, Flame, ArrowUpRight, Award, Zap } from 'lucide-react';
import { Tournament } from '../types';
import { POPULAR_GAMES } from '../data/initialData';

interface GamesSectionProps {
  tournaments: Tournament[];
  onRegisterTournament: (tournament: Tournament) => void;
  onOpenBooking: () => void;
}

export default function GamesSection({
  tournaments,
  onRegisterTournament,
  onOpenBooking,
}: GamesSectionProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Tactical FPS', 'Sports & Football', 'Battle Royale', 'Racing Simulation', 'Fighting / Versus', 'Action & Open World'];

  const filteredGames = selectedGenre === 'All'
    ? POPULAR_GAMES
    : POPULAR_GAMES.filter((g) => g.genre.toLowerCase().includes(selectedGenre.toLowerCase()));

  const leaderboard = [
    { rank: '01', player: 'ShadowStriker', title: 'CS2 Headshot King', score: '84.2% HS', reward: '50h Pass Holder' },
    { rank: '02', player: 'ApexViper_09', title: 'Valorant Radiant', score: '428 ACS', reward: 'VIP Squad Pass' },
    { rank: '03', player: 'MonzaGhost', title: 'Spa GT3 Record', score: '2:15.340', reward: '$100 Sim Rig Credit' },
    { rank: '04', player: 'GoldenBoots', title: 'FC 25 Champion', score: '32-0 Streak', reward: 'Gold Member' },
  ];

  return (
    <section id="games" className="relative py-24 border-b border-neutral-800 bg-[#050508]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Sub-Section 1: Games Library */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
                <span>Optimized & Pre-Installed</span>
                <span aria-hidden="true">·</span>
                <span>Gigabit LAN Updates</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                GAMES & ESPORTS TITLES
              </h2>
              <p className="mt-3 text-neutral-400 max-w-2xl text-base leading-relaxed">
                Over 250+ AAA and esports games pre-installed on high-speed Gen4 NVMe SSDs. Zero download waiting time. Just log in and play.
              </p>
            </div>

            {/* Genre Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    selectedGenre === genre
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="group rounded-2xl border border-neutral-800 bg-[#0a0a13] p-5 hover:border-purple-500/40 hover:bg-[#0d0d1a] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-neutral-400">
                      {game.platform}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {game.fps}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold uppercase text-white group-hover:text-cyan-300 transition-colors">
                    {game.name}
                  </h3>

                  <div className="text-xs text-purple-400 font-medium mt-1">
                    {game.genre} · {game.developer}
                  </div>

                  <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    Instant Launch Ready
                  </span>
                  <button
                    onClick={onOpenBooking}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group/btn"
                  >
                    <span>Play Now</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Section 2: Tournaments */}
        <div id="tournaments">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
                <span>Competitive Esports Circuit</span>
                <span aria-hidden="true">·</span>
                <span>Cash Prizes & Trophies</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                UPCOMING TOURNAMENTS
              </h2>
              <p className="mt-3 text-neutral-400 max-w-2xl text-base leading-relaxed">
                Test your skills against the region's sharpest players. Full LAN tournament infrastructure with shoutcasters, live Twitch streams, and instant cash payouts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments.map((t) => (
              <div
                key={t.id}
                className="relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/90 to-[#0c0c16] p-6 hover:border-purple-500/50 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {t.game}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded">
                      {t.prizePool}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase text-white">
                    {t.title}
                  </h3>

                  <div className="mt-3 space-y-1.5 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-400 shrink-0" />
                      <span>{t.date} at {t.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-400 shrink-0" />
                      <span>{t.format} · Entry: {t.entryFee}</span>
                    </div>
                  </div>

                  {/* Registered Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-400">Team Capacity:</span>
                      <span className="font-mono text-white font-medium">
                        {t.registeredCount} / {t.maxTeams} Teams Enrolled
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-500"
                        style={{ width: `${(t.registeredCount / t.maxTeams) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-emerald-400">
                    {t.maxTeams - t.registeredCount} spots remaining
                  </span>

                  <button
                    onClick={() => onRegisterTournament(t)}
                    disabled={t.registeredCount >= t.maxTeams}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-40 transition-all whitespace-nowrap"
                  >
                    <Trophy className="h-4 w-4" />
                    <span>Register Team</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Section 3: Community Leaderboard & Hot Laps */}
        <div className="rounded-2xl border border-neutral-800 bg-[#080812] p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold uppercase text-white">
                  This Week's Cafe Hall of Fame
                </h3>
                <span className="text-xs text-neutral-400">
                  Verified LAN scores updated weekly every Sunday midnight
                </span>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="text-xs font-semibold text-cyan-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Set Your Score</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaderboard.map((item) => (
              <div
                key={item.player}
                className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-cyan-400">
                    #{item.rank}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-400 tabular-nums">
                    {item.score}
                  </span>
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-white">
                    {item.player}
                  </h4>
                  <div className="text-xs text-neutral-400">{item.title}</div>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-800 text-[11px] text-purple-300 font-medium">
                  Reward: {item.reward}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
