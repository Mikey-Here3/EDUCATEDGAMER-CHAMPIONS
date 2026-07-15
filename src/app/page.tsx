"use client";

// Vercel Build Trigger: Google OAuth and Neon PostgreSQL config sync
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  Gamepad2,
  ChevronDown,
  Search,
  UserPlus,
  Swords,
  MessageCircle,
  Calendar,
  Zap,
  Play,
  Share2,
  Clock,
  Shield,
  HelpCircle,
  Award,
  Crosshair,
  Flame,
  Map,
  Compass,
  ArrowRight,
  Tv,
  Settings,
  Crown,
} from "lucide-react";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NeonButton } from "@/components/shared/NeonButton";
import { CountUp } from "@/components/shared/CountUp";

// ─── Custom Icons ────────────────────────────────────────
const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TikTok = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const activeTournament = {
  id: "br-ff-cup-s4",
  name: "Educated Gamer 9,000 Diamonds Championship",
  game: "Free Fire (Battle Royale)",
  description: "The ultimate Battle Royale showcase for elite mobile Free Fire Guilds. 24 teams clash in custom limited ammo rooms across 5 legendary maps, streamed live on YouTube.",
  status: "OPEN" as const,
  prizePool: "9,000 Diamonds Total (1st: 5000, 2nd: 2000, 3rd: 1000, 4th/5th: 500 each)",
  entryFee: "400 PKR per Team of 5 Members",
  mode: "Squad Battle Royale (Max 24 Teams)",
  format: "5 Maps Point System (Limited Ammo)",
  region: "South Asia (India/Nepal/Bangladesh/Pakistan)",
  matchTime: "To Be Announced (Once all 24 slots register)",
  deadline: "TBA (Approx. August/September 2026)",
  gradient: "from-purple-900 via-violet-950 to-black",
};

const maps = [
  { name: "Bermuda", type: "Classic BR Map" },
  { name: "Purgatory", type: "Tactical Valley BR Map" },
  { name: "Kalahari", type: "Desert BR Map" },
  { name: "Alpine", type: "Snowy Highlands BR Map" },
  { name: "Bermuda Remastered", type: "Remastered Classic BR Map" },
];

const pointSystem = [
  { position: "1st (BOOYAH)", points: "12 PTS" },
  { position: "2nd Position", points: "10 PTS" },
  { position: "3rd Position", points: "8 PTS" },
  { position: "4th Position", points: "5 PTS" },
  { position: "5th Position", points: "4 PTS" },
  { position: "6th Position", points: "3 PTS" },
  { position: "7th Position", points: "2 PTS" },
  { position: "8th Position", points: "1 PT" },
  { position: "Per Kill", points: "1 PT" },
];

const stats = [
  { label: "Total Diamonds", value: 9000, prefix: "", suffix: " 💎" },
  { label: "Entry Fee", value: 400, prefix: "", suffix: " PKR" },
  { label: "Max Guild Teams", value: 24, prefix: "", suffix: " Teams" },
  { label: "Maps Count", value: 5, prefix: "", suffix: " Maps" },
  { label: "Peak Live Viewers", value: 8500, prefix: "", suffix: "+" },
  { label: "Active Players", value: 120, prefix: "", suffix: "+" },
];

const rules = [
  { item: "Battle Royale Format", desc: "Matches are played in custom rooms with e-sports competitive Battle Royale settings." },
  { item: "Limited Ammo Enabled", desc: "Limited Ammo is set to YES. Guns have standard ammunition counts for pure resource strategy." },
  { item: "Mobile Only Allowed", desc: "Only mobile device players are allowed. PC players, emulator setups, and hardware triggers are strictly banned." },
  { item: "Restricted Play Styles", desc: "No double tap mechanics. No active player reviving allowed. High-ground roof camping is strictly prohibited." },
  { item: "Custom Rooms Creator", desc: "Custom lobbies are set up by Educated Gamer. Login codes are shared in the WhatsApp group 15 mins before match start." },
  { item: "Features & Highlights", desc: "Winners can submit custom edited gameplay clips to be featured on live streams or YouTube highlight videos." },
];

const schedule = [
  { round: "Group A Match (5 Maps)", status: "Pending Rosters", desc: "Lobbies will be scheduled once 24 teams confirm." },
  { round: "Group B Match (5 Maps)", status: "Pending Rosters", desc: "Lobbies will be scheduled once 24 teams confirm." },
  { round: "Semi Finals (Top 10 Teams)", status: "Pending Rosters", desc: "Qualified teams clash across 5 maps." },
  { round: "Grand Finale (Top 4 GvG)", status: "Pending Rosters", desc: "Ultimate championship lobby." },
];

const faqs = [
  { q: "How can my Guild register?", a: "Go to the Registration page. Fill in the Captain's details (WhatsApp, UID, email, nickname), Guild name, and roster details of 5 active squad members. You must upload a screenshot of your Captain's UID page." },
  { q: "Are emulators / PC players allowed?", a: "No, this is a mobile-only tournament. Emulators, iPad triggers, and controller plugins are strictly banned. Room anti-cheat will automatically detect and kick violators." },
  { q: "How does the qualification format work?", a: "If 24 teams register, they are split into two rooms (12 teams each). Both groups play 5 matches across all 5 maps. The top 5 teams from each group qualify for the next round (10 teams total). The top 4 teams from that round advance to the Grand Finale." },
  { q: "When do we get Room ID and Password?", a: "Lobby codes are sent directly to the Captains' official WhatsApp group 15 minutes before the match start time." },
];

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#030014]">
      {/* Mouse Glow Background Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-all duration-300 hidden md:block"
        style={{
          background: `radial-gradient(400px at ${mousePos.x}px ${mousePos.y}px, rgba(123, 46, 255, 0.08), transparent)`,
        }}
      />

      {/* Lightning Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(123,46,255,0.02)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-between pt-32 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/hero_bg.jpg')" }}
      >
        {/* Dark overlays to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />

        <div className="relative z-20 max-w-6xl w-full mx-auto px-4 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 pb-12">
          {/* Left Text Column */}
          <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] border border-[var(--color-primary)]/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-glow-pulse">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> 9,000 Diamonds Prize Pool
              </span>
            </motion.div>

            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-6xl sm:text-7xl md:text-8xl font-black italic tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                <span className="text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]">EDUCATED</span>
                <br />
                <span className="text-[var(--color-primary-light)] drop-shadow-[0_4px_20px_rgba(123,46,255,0.4)]">GAMER</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl text-gray-300 font-bold tracking-widest uppercase"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                Official Free Fire Tournament
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="inline-block"
              >
                <span className="inline-block px-4 py-1 rounded bg-[var(--color-primary)]/30 border border-[var(--color-primary)] text-xs font-black uppercase tracking-wider text-white">
                  Season 4
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 pt-2"
              >
                <span className="text-[var(--color-accent)] font-bold">Play • Compete • Win.</span>
                <br />
                24 elite Guilds battle across 5 maps under e-sports competitive settings. Only mobile players allowed.
              </motion.p>
            </div>

            {/* Horizontal Stats Row matching mockup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="max-w-xl mx-auto lg:mx-0 grid grid-cols-4 gap-4 p-4 bg-black/60 border border-[var(--color-border)] rounded-2xl backdrop-blur-md"
            >
              <div className="text-center">
                <span className="text-lg md:text-xl font-black text-white block">9,000</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Diamonds</span>
              </div>
              <div className="text-center border-l border-white/10">
                <span className="text-lg md:text-xl font-black text-[var(--color-primary-light)] block">24</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Elite Guilds</span>
              </div>
              <div className="text-center border-l border-white/10">
                <span className="text-lg md:text-xl font-black text-white block">5</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Maps</span>
              </div>
              <div className="text-center border-l border-white/10">
                <span className="text-lg md:text-xl font-black text-[var(--color-accent)] block">1</span>
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Champion</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link href="/tournaments/br-ff-cup-s4/register">
                <NeonButton size="md" variant="primary" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" /> Register Guild Team
                </NeonButton>
              </Link>
              <Link href="#rules">
                <NeonButton size="md" variant="secondary" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Rules & Settings
                </NeonButton>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mockup Sticky Bottom Bar */}
        <div className="relative z-20 w-full border-t border-white/10 bg-black/70 backdrop-blur-md py-4 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-semibold text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>
                  <strong className="text-white">LIVE MATCHES:</strong> WATCH ON YOUTUBE
                </span>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-8">
                <Clock className="w-4 h-4 text-[var(--color-primary-light)]" />
                <span>
                  <strong className="text-white">REAL TIME:</strong> LIVE UPDATES
                </span>
              </div>
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-8">
                <Shield className="w-4 h-4 text-green-500" />
                <span>
                  <strong className="text-white">FAIR PLAY:</strong> COMPETITIVE ENVIRONMENT
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">One Team One Goal</span>
              <span className="px-2 py-0.5 rounded bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[9px] font-black text-white tracking-widest uppercase">
                EG
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ QUICK STATS ═══════════════ */}
      <section id="stats" className="py-16 px-4 border-b border-[var(--color-border)] bg-black/40 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</p>
                <div
                  className="text-2xl md:text-3xl font-black text-white"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ LIVE STREAM SECTION ═══════════════ */}
      <section id="stream" className="py-20 px-4 relative z-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <SectionHeading title="YouTube Live Broadcast" subtitle="Join stream draw pools, roster releases, and match day streams." />
          
          <GlowCard hover={false} className="p-0 overflow-hidden border-[var(--color-primary)]/40">
            {/* Live Indicator Bar */}
            <div className="bg-black/60 px-4 py-3 flex items-center justify-between border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-500">LIVE DRAW & LOBBIES</span>
              </div>
              <a
                href="https://youtube.com/@EducatedGamer3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-primary-light)] font-semibold flex items-center gap-1 hover:underline"
              >
                Open in YouTube <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Video Container */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/live_stream?channel=UCEducatedGamerChannelIDFallback"
                title="Educated Gamer Live Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            
            {/* Channel Name Banner below Stream */}
            <div className="p-4 bg-black/60 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
                  Broadcast Channel: Educated Gamer
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">Stream schedules will update once all 24 rosters confirm entry.</p>
              </div>
              <NeonButton href="https://youtube.com/@EducatedGamer3/live" variant="primary" size="sm">
                <MessageCircle className="w-4 h-4" /> Open YouTube Chat
              </NeonButton>
            </div>
          </GlowCard>
        </div>
      </section>

      {/* ═══════════════ TOURNAMENT DETAILS ═══════════════ */}
      <section id="tournament" className="py-20 px-4 bg-[var(--color-bg-dark)]/40 relative z-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <SectionHeading title="Tournament Overview" subtitle="Roster setup, map schedules, and entry payout sequences." />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Description & Maps */}
            <GlowCard className="lg:col-span-2 space-y-6 flex flex-col justify-between" hover={false}>
              <div className="space-y-4">
                <div className="h-48 bg-gradient-to-br from-purple-900 to-indigo-950 rounded-xl relative overflow-hidden flex items-end p-6 border border-[var(--color-border)]">
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(123,46,255,0.4),transparent_70%)]" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-xs font-black uppercase text-[var(--color-accent)] tracking-widest">Free Fire Mobile</span>
                    <h3 className="text-xl md:text-3xl font-black text-white animate-pulse" style={{ fontFamily: "var(--font-orbitron)" }}>{activeTournament.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">{activeTournament.description}</p>

                {/* Entry Fee & Basic Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black/30 border border-[var(--color-border)] rounded-xl text-xs">
                  <div>
                    <span className="text-gray-500 uppercase block tracking-wider font-semibold">Total Prize</span>
                    <span className="text-[var(--color-accent)] font-bold text-sm">9,000 Diamonds</span>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase block tracking-wider font-semibold">Entry Fee</span>
                    <span className="text-white font-bold text-sm">400 PKR / Team</span>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase block tracking-wider font-semibold">Format</span>
                    <span className="text-white font-bold text-sm">Squad BR (5 Maps)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 uppercase block tracking-wider font-semibold">Roster Size</span>
                    <span className="text-white font-bold text-sm">5 Core + 1 Sub</span>
                  </div>
                </div>

                {/* Prize Breakdown Sequence */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5" style={{ fontFamily: "var(--font-orbitron)" }}>
                    <Award className="w-4 h-4 text-yellow-500" /> Prize Distribution Sequence
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <span className="text-[10px] text-gray-400 block font-semibold">1st Place</span>
                      <span className="text-yellow-500 font-bold">5,000 💎</span>
                    </div>
                    <div className="p-2.5 bg-slate-300/10 border border-slate-300/20 rounded-lg">
                      <span className="text-[10px] text-gray-400 block font-semibold">2nd Place</span>
                      <span className="text-slate-300 font-bold">2,000 💎</span>
                    </div>
                    <div className="p-2.5 bg-amber-600/10 border border-amber-600/20 rounded-lg">
                      <span className="text-[10px] text-gray-400 block font-semibold">3rd Place</span>
                      <span className="text-amber-600 font-bold">1,000 💎</span>
                    </div>
                    <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <span className="text-[10px] text-gray-400 block font-semibold">4th Place</span>
                      <span className="text-purple-400 font-bold">500 💎</span>
                    </div>
                    <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <span className="text-[10px] text-gray-400 block font-semibold">5th Place</span>
                      <span className="text-purple-400 font-bold">500 💎</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Rotation Grid */}
              <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5" style={{ fontFamily: "var(--font-orbitron)" }}>
                  <Map className="w-4 h-4 text-[var(--color-primary-light)]" /> 5-Map Rotation Series
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {maps.map((map) => (
                    <div key={map.name} className="p-2 bg-black/40 border border-[var(--color-border)] rounded-lg text-center">
                      <p className="text-xs font-bold text-white">{map.name}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5 truncate">{map.type}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>

            {/* Right - Point System & Register CTA */}
            <GlowCard className="space-y-6 flex flex-col justify-between" hover={false}>
              <div className="space-y-4">
                <h3 className="text-base font-bold border-b border-[var(--color-border)] pb-2 uppercase tracking-wider text-white flex items-center gap-2" style={{ fontFamily: "var(--font-orbitron)" }}>
                  <Compass className="w-4 h-4 text-[var(--color-accent)]" /> GvG Point System
                </h3>
                
                <div className="space-y-2 text-xs">
                  {pointSystem.map((item) => (
                    <div key={item.position} className="flex justify-between items-center bg-black/20 p-1.5 rounded border border-white/5">
                      <span className="text-gray-400">{item.position}</span>
                      <span className="font-bold text-[var(--color-accent)] font-mono">{item.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--color-border)] text-xs text-gray-400">
                <div className="flex flex-col gap-1 text-center bg-black/40 p-2.5 rounded-lg border border-[var(--color-border)] mb-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Schedule Status</span>
                  <span className="text-yellow-500 font-bold">To Be Announced</span>
                  <span className="text-[9px] text-gray-400">(TBA Once all 24 slots confirm registration)</span>
                </div>
                <Link href="/tournaments/br-ff-cup-s4/register" className="w-full block">
                  <NeonButton variant="primary" size="md" className="w-full">
                    Register Guild <ArrowRight className="w-4 h-4" />
                  </NeonButton>
                </Link>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* ═══════════════ TOURNAMENT RULES ═══════════════ */}
      <section id="rules" className="py-20 px-4 relative z-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <SectionHeading title="Esports Rules & Settings" subtitle="Standard e-sports custom room configurations apply. Mobile players only." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule, idx) => (
              <GlowCard key={rule.item} className="p-5 flex items-start gap-4" hover={false}>
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-border)] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-[var(--color-primary-light)] font-bold">{idx + 1}</span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{rule.item}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{rule.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ LEADERBOARD SECTION ═══════════════ */}
      <section id="leaderboard" className="py-20 px-4 bg-[var(--color-bg-dark)]/40 relative z-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <SectionHeading title="Standings Leaderboard" subtitle="Official tournament rankings will display here." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Teams Placeholder */}
            <GlowCard hover={false} className="space-y-4">
              <h3 className="text-lg font-bold border-b border-[var(--color-border)] pb-2 flex items-center gap-2 uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                <Trophy className="w-5 h-5 text-yellow-500" /> Guild Rankings
              </h3>
              <div className="p-8 text-center text-gray-500 border border-dashed border-[var(--color-border)] rounded-xl bg-black/25 text-xs">
                No standings yet. Standings will update once the tournament matches begin.
              </div>
            </GlowCard>

            {/* Top Players Placeholder */}
            <GlowCard hover={false} className="space-y-4">
              <h3 className="text-lg font-bold border-b border-[var(--color-border)] pb-2 flex items-center gap-2 uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                <Crosshair className="w-5 h-5 text-[var(--color-primary-light)]" /> Player MVP Rankings
              </h3>
              <div className="p-8 text-center text-gray-500 border border-dashed border-[var(--color-border)] rounded-xl bg-black/25 text-xs">
                No MVP statistics recorded yet. Standings will display once games start.
              </div>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* ═══════════════ SCHEDULE SECTION ═══════════════ */}
      <section id="schedule" className="py-20 px-4 relative z-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <SectionHeading title="Match Brackets & Rooms" subtitle="Group custom lobby scheduling schedules." />
          
          <div className="space-y-4">
            {schedule.map((match, i) => (
              <motion.div
                key={match.round}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <GlowCard hover={true} className="py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div className="w-12 h-12 rounded-xl bg-black/40 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary-light)] font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white" style={{ fontFamily: "var(--font-orbitron)" }}>{match.round}</h4>
                      <p className="text-xs text-gray-500">{match.desc}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-500 font-semibold uppercase">
                    {match.status}
                  </span>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ RESULTS SECTION ═══════════════ */}
      <section id="results" className="py-20 px-4 bg-[var(--color-bg-dark)]/40 relative z-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <SectionHeading title="Championship Winners" subtitle="Historical records of previous finale winners." />
          
          <GlowCard hover={false} className="p-8 text-center text-gray-500 border border-dashed border-[var(--color-border)] bg-black/25 text-xs">
            No match results recorded yet. Latest results will display here once the custom rooms are completed.
          </GlowCard>
        </div>
      </section>

      {/* ═══════════════ GALLERY SECTION ═══════════════ */}
      <section id="gallery" className="py-20 px-4 relative z-20">
        <div className="max-w-5xl mx-auto space-y-10">
          <SectionHeading title="Highlights Gallery" subtitle="Watch custom room battles, clutches, and live stream highlights from Educated Gamer." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Free Fire Live Custom Rooms - Diamond Giveaway", embedId: "P2G9lG6RlyU", desc: "Interactive matches with subscriber custom rooms and weekly memberships." },
              { title: "1v4 Rush Gameplay Clutch Montage", embedId: "dQw4w9WgXcQ", desc: "Best headshot compilations and tactical rush plays on mobile." },
              { title: "Educated Gamer Guild vs Guild Tournament S3 Finals", embedId: "P2G9lG6RlyU", desc: "Highlights from the Season 3 championship showdown." },
              { title: "Top Free Fire Clash Squad Tips & Tricks", embedId: "dQw4w9WgXcQ", desc: "Tactical positioning and squad movement highlights on Bermuda." },
            ].map((video, idx) => (
              <GlowCard key={idx} hover={true} className="p-0 overflow-hidden border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all flex flex-col justify-between">
                <div className="aspect-video w-full bg-black relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.embedId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-black/60 border-t border-[var(--color-border)]">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>{video.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{video.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      <section id="faq" className="py-20 px-4 bg-[var(--color-bg-dark)]/40 relative z-20">
        <div className="max-w-3xl mx-auto space-y-10">
          <SectionHeading title="Frequently Asked" subtitle="Everything you need to know about the tournament system, maps, and payouts." />
          
          <div className="space-y-4">
            {faqs.map((faq) => (
              <GlowCard key={faq.q} className="p-5 space-y-2" hover={false}>
                <h4 className="font-bold text-white flex items-center gap-2 text-sm md:text-base" style={{ fontFamily: "var(--font-orbitron)" }}>
                  <HelpCircle className="w-4 h-4 text-[var(--color-primary-light)]" /> {faq.q}
                </h4>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed pl-6">{faq.a}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COMMUNITY SECTION ═══════════════ */}
      <section className="py-20 px-4 relative border-t border-[var(--color-border)] z-20">
        <div className="max-w-4xl mx-auto space-y-10">
          <SectionHeading title="Join the Community" subtitle="Join LFG groups, WhatsApp channels, and social hubs." />
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: MessageCircle, name: "WhatsApp", color: "from-green-600/10 to-emerald-600/10 border-green-500/20 text-green-400", href: "https://chat.whatsapp.com/FNAfIjgLAo64IwNSRyy7OB" },
              { icon: MessageCircle, name: "Discord", color: "from-indigo-600/10 to-purple-600/10 border-indigo-500/20 text-indigo-400", href: "https://discord.gg/educatedgamer3" },
              { icon: Youtube, name: "YouTube", color: "from-red-600/10 to-rose-600/10 border-red-500/20 text-red-500", href: "https://www.youtube.com/@EducatedGamer3" },
              { icon: TikTok, name: "TikTok", color: "from-gray-600/10 to-slate-600/10 border-gray-500/20 text-slate-300", href: "https://www.tiktok.com/@educatedgamer3" },
              { icon: Facebook, name: "Facebook", color: "from-blue-600/10 to-cyan-600/10 border-blue-500/20 text-blue-400", href: "https://www.facebook.com/educatedgamer3" },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-5 rounded-xl border bg-gradient-to-br ${social.color} hover:scale-105 transition-all text-center space-y-2`}
              >
                <social.icon className="w-6 h-6" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{social.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
