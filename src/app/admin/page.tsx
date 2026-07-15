"use client";

import { useState, useEffect, startTransition } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { getTournaments, updateTournament } from "@/actions/tournament.actions";
import {
  getRegistrations,
  updatePaymentStatus,
  updateRegistrationStatus,
  deleteRegistration,
} from "@/actions/registration.actions";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NeonButton } from "@/components/shared/NeonButton";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import {
  Trophy,
  Users,
  Shield,
  FileCheck,
  Plus,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Check,
  X,
  Lock,
  Key,
  Gamepad,
  Volume2,
  Tv,
  Image as ImageIcon,
  Search,
  Trash2,
  ExternalLink,
  Info,
  SlidersHorizontal,
  Unlock,
  LogOut,
} from "lucide-react";

// Mock Data for GvG Fallback
const mockActiveTournament = {
  id: "gvg-ff-cup-s4",
  name: "Educated Gamer Guild vs Guild Championship",
  game: "Free Fire",
  prizePool: "9,000 Diamonds",
  registeredCount: 2,
  maxSlots: 48,
  status: "OPEN",
  mode: "Squad (GvG)",
  format: "Best of 3",
  allowedWeapons: "Desert Eagle, M1887, M1014, Woodpecker",
  region: "South Asia",
  matchTime: "August 1, 2026 @ 18:00 IST",
  deadline: "July 28, 2026 @ 23:59 IST",
};

const mockRegistrations = [
  {
    id: "reg-1",
    playerName: "Aman Sharma",
    gamertag: "MambaGaming",
    email: "aman@gmail.com",
    phone: "+92 300 1234567",
    teamName: "Team Soul GvG",
    type: "SQUAD",
    paymentStatus: "PENDING",
    status: "PENDING",
    uidScreenshot: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
    paymentScreenshot: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600",
    createdAt: new Date().toISOString(),
    teamMembers: [
      { playerName: "Rohan Das", gamertag: "SoulRohan", gameUID: "67812903" },
      { playerName: "Ketan Mehta", gamertag: "SoulKetan", gameUID: "12890374" },
      { playerName: "Yash Sen", gamertag: "SoulYash", gameUID: "90127394" },
      { playerName: "Dev Verma", gamertag: "SoulDev", gameUID: "43890123" },
    ],
  },
  {
    id: "reg-2",
    playerName: "Vikram Rathore",
    gamertag: "ViperYT",
    email: "vikram@gmail.com",
    phone: "+92 315 7654321",
    teamName: "TSG Army GvG",
    type: "SQUAD",
    paymentStatus: "VERIFIED",
    status: "CONFIRMED",
    uidScreenshot: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600",
    paymentScreenshot: null,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    teamMembers: [
      { playerName: "Amit Roy", gamertag: "TSGAmit", gameUID: "3489012" },
      { playerName: "Sumit Dey", gamertag: "TSGSumit", gameUID: "9081234" },
      { playerName: "Rahul Dev", gamertag: "TSGRahul", gameUID: "2349081" },
      { playerName: "Joy Sen", gamertag: "TSGJoy", gameUID: "1239045" },
    ],
  },
];

export default function AdminPage() {
  const { data: session } = useSession();
  const isGoogleAdmin = session?.user?.role === "ADMIN";

  // Passcode Security States
  const [passcode, setPasscode] = useState("");
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState("");

  const isAuthorized = isGoogleAdmin || adminAuthenticated;

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "registrations" | "rooms" | "results" | "season"
  >("registrations");

  // State Data
  const [activeTourney, setActiveTourney] = useState<any>(mockActiveTournament);
  const [registrations, setRegistrations] = useState<any[]>(mockRegistrations);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "CONFIRMED" | "CANCELLED">("ALL");

  // Selected Registration for Inspector Modal
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  
  // Image Lightbox State
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Room Generator States
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");
  const [roomMsg, setRoomMsg] = useState("");

  // Match Results States
  const [winnerGuild, setWinnerGuild] = useState("");
  const [runnerGuild, setRunnerGuild] = useState("");
  const [matchScore, setMatchScore] = useState("3 - 1");
  const [matchMvp, setMatchMvp] = useState("");
  const [resultMsg, setResultMsg] = useState("");

  // Active Season Form State
  const [tourneyName, setTourneyName] = useState(mockActiveTournament.name);
  const [prizePool, setPrizePool] = useState(mockActiveTournament.prizePool);
  const [allowedWeapons, setAllowedWeapons] = useState(mockActiveTournament.allowedWeapons);
  const [matchTime, setMatchTime] = useState(mockActiveTournament.matchTime);
  const [deadline, setDeadline] = useState(mockActiveTournament.deadline);
  const [statusVal, setStatusVal] = useState(mockActiveTournament.status);
  const [configMsg, setConfigMsg] = useState("");

  // Check saved passcode on mount
  useEffect(() => {
    const savedPass = localStorage.getItem("eg_admin_passcode") || "";
    const correctPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "educatedgamer3admin";
    if (savedPass === correctPass) {
      setAdminAuthenticated(true);
      setPasscode(savedPass);
    }
  }, []);

  // Handle Passcode Login
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const correctPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "educatedgamer3admin";
    if (passcode === correctPass) {
      localStorage.setItem("eg_admin_passcode", passcode);
      setAdminAuthenticated(true);
    } else {
      setAdminError("Invalid security passcode. Access denied.");
    }
  };

  const handlePasscodeLogout = () => {
    localStorage.removeItem("eg_admin_passcode");
    setAdminAuthenticated(false);
    setPasscode("");
  };

  // Load Real Data if Authorized
  useEffect(() => {
    if (isAuthorized) {
      getTournaments().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          const current = res.data[0]; // Active season tournament is the latest one
          setActiveTourney(current);
          setTourneyName(current.name);
          setPrizePool(current.prizePool || "");
          setAllowedWeapons(current.rules || "");
          setStatusVal(current.status);

          getRegistrations(current.id, passcode).then((regRes) => {
            if (regRes.success && regRes.data) {
              setRegistrations(regRes.data);
            }
          });
        }
      });
    }
  }, [isAuthorized, passcode]);

  // Handle Verify/Confirm Action
  const handleVerifyRegistration = async (id: string, approve: boolean) => {
    const statusVal = approve ? "CONFIRMED" : "CANCELLED";
    const paymentVal = approve ? "VERIFIED" : "REJECTED";

    if (id.startsWith("reg-")) {
      // Mock update
      const updated = registrations.map((r) =>
        r.id === id ? { ...r, status: statusVal, paymentStatus: paymentVal } : r
      );
      setRegistrations(updated);
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg({ ...selectedReg, status: statusVal, paymentStatus: paymentVal });
      }
      return;
    }

    // Real DB update
    const res = await updateRegistrationStatus(id, statusVal, passcode);
    if (res.success) {
      await updatePaymentStatus(id, paymentVal, passcode);
      const updated = registrations.map((r) =>
        r.id === id ? { ...r, status: statusVal, paymentStatus: paymentVal } : r
      );
      setRegistrations(updated);
      if (selectedReg && selectedReg.id === id) {
        setSelectedReg({ ...selectedReg, status: statusVal, paymentStatus: paymentVal });
      }
    }
  };

  // Handle Delete Registration Action
  const handleDeleteRegistration = async (id: string) => {
    if (!window.confirm("Are you absolutely sure you want to delete this registration? This will delete all team roster data and cannot be undone.")) {
      return;
    }

    if (id.startsWith("reg-")) {
      // Mock delete
      setRegistrations(registrations.filter((r) => r.id !== id));
      setSelectedReg(null);
      return;
    }

    // Real DB delete
    const res = await deleteRegistration(id, passcode);
    if (res.success) {
      setRegistrations(registrations.filter((r) => r.id !== id));
      setSelectedReg(null);
      alert("Registration deleted successfully!");
    } else {
      alert(res.message || "Failed to delete registration");
    }
  };

  // Generate Room credentials
  const handleGenerateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setRoomMsg("");
    setRoomMsg(`Room credentials generated and published. Room ID: ${roomId} | PW: ${roomPassword}`);
  };

  // Update Match Results
  const handlePostResult = (e: React.FormEvent) => {
    e.preventDefault();
    setResultMsg("");
    setResultMsg(`Match results posted! Winner: ${winnerGuild} | Runner-up: ${runnerGuild}`);
    setWinnerGuild("");
    setRunnerGuild("");
    setMatchMvp("");
  };

  // Save Active Season Settings
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfigMsg("");

    const payload = {
      ...activeTourney,
      name: tourneyName,
      prizePool,
      rules: allowedWeapons,
      status: statusVal,
    };

    if (!isAuthorized) {
      setActiveTourney({
        ...activeTourney,
        name: tourneyName,
        prizePool,
        allowedWeapons,
        matchTime,
        deadline,
        status: statusVal,
      });
      setConfigMsg("Demo settings updated successfully!");
      return;
    }

    startTransition(async () => {
      const res = await updateTournament(activeTourney.id, payload, passcode);
      if (res.success && res.data) {
        setActiveTourney(res.data);
        setConfigMsg("Database season settings updated successfully!");
      } else {
        setConfigMsg(res.message || "Failed to update configuration");
      }
    });
  };

  // Filter & Search Registrations
  const filteredRegs = registrations.filter((reg) => {
    const matchesSearch =
      (reg.teamName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.playerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.gamertag || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "ALL") return matchesSearch;
    return matchesSearch && reg.status === filterStatus;
  });

  // ─── Security Gate Render ───────────────────────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#030014] px-4 overflow-hidden">
        <ParticleBackground />
        
        {/* Lightning Overlay Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(123,46,255,0.02)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

        <div className="relative z-20 w-full max-w-md">
          <form onSubmit={handlePasscodeSubmit}>
            <GlowCard hover={false} className="p-8 text-center space-y-6 border-[var(--color-primary)]/20 bg-black/60 backdrop-blur-xl">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-red-500/20">
                  <Lock className="w-3.5 h-3.5" /> Restricted Command Area
                </span>
                <h2 className="text-2xl font-black italic tracking-tighter text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                  ADMIN <span className="text-[var(--color-primary-light)]">COMMAND</span>
                </h2>
                <p className="text-xs text-gray-400">
                  Please enter your Admin Passcode credentials to gain console authorization.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black pl-1">Security Passcode</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••"
                    className="w-full text-center"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                </div>

                {adminError && (
                  <p className="text-xs text-red-500 font-semibold">{adminError}</p>
                )}

                <NeonButton type="submit" variant="primary" className="w-full flex items-center justify-center gap-2">
                  <Unlock className="w-4 h-4" /> Unlock Console
                </NeonButton>
              </div>
            </GlowCard>
          </form>
        </div>
      </div>
    );
  }

  // ─── Authenticated Console Render ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] pt-32 pb-20 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner Title */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] text-xs font-bold uppercase tracking-wider mb-2 border border-[var(--color-primary)]/20">
              <Shield className="w-3.5 h-3.5" /> GvG Controller
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              Admin Command Console
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {adminAuthenticated && (
              <button
                onClick={handlePasscodeLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 text-xs font-bold text-red-400 cursor-pointer transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> Lock Console
              </button>
            )}
            {!isGoogleAdmin && !adminAuthenticated && (
              <div className="glass-card px-4 py-2 border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs flex items-center gap-2 max-w-sm rounded-xl">
                <Lock className="w-4 h-4 flex-shrink-0" />
                <p>Demo Mode active. Log in as Admin to write to Neon database.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlowCard className="p-4 text-center" hover={false}>
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Active Season</p>
            <h4 className="text-lg font-bold text-white">Season 4 GvG</h4>
          </GlowCard>
          <GlowCard className="p-4 text-center" hover={false}>
            <Users className="w-6 h-6 text-[var(--color-accent)] mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Total Applications</p>
            <h4 className="text-lg font-bold text-white">{registrations.length}</h4>
          </GlowCard>
          <GlowCard className="p-4 text-center" hover={false}>
            <FileCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Verified Guilds</p>
            <h4 className="text-lg font-bold text-white">
              {registrations.filter((r) => r.status === "CONFIRMED").length}
            </h4>
          </GlowCard>
          <GlowCard className="p-4 text-center" hover={false}>
            <Key className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Room Status</p>
            <h4 className="text-lg font-bold text-white">{roomId ? "Published" : "Not Created"}</h4>
          </GlowCard>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[var(--color-border)] gap-6 overflow-x-auto pb-1.5 scrollbar-thin">
          {[
            { id: "registrations", label: "Rosters & UID Proofs" },
            { id: "rooms", label: "Lobby Room ID" },
            { id: "results", label: "Match Results" },
            { id: "season", label: "Active Season Config" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-semibold relative transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "text-[var(--color-primary-light)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="adminTabLine"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="relative">
          {/* Tab 1: Registrations & Roster Management */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 p-4 border border-[var(--color-border)] rounded-2xl">
                <div className="relative w-full md:max-w-md">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Guild Name, Captain, Gamertag, or Phone..."
                    className="pl-10 pr-4 py-2 text-xs md:text-sm bg-black/60 border border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1.5 md:pb-0">
                  {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        filterStatus === status
                          ? "bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] border-[var(--color-primary)]/40"
                          : "bg-black/40 text-gray-400 border-white/5 hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* registrations Table */}
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-bold text-gray-400 uppercase">
                        <th className="p-4">Guild / Captain</th>
                        <th className="p-4">WhatsApp Contact</th>
                        <th className="p-4">UID Proof Status</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Manage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-xs md:text-sm">
                      {filteredRegs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-gray-500 font-semibold">
                            No team applications match the selected filters.
                          </td>
                        </tr>
                      ) : (
                        filteredRegs.map((reg) => (
                          <tr
                            key={reg.id}
                            className="hover:bg-[var(--color-surface)]/60 transition-all cursor-pointer group"
                            onClick={() => setSelectedReg(reg)}
                          >
                            <td className="p-4">
                              <p className="font-bold text-white group-hover:text-[var(--color-primary-light)] transition-colors">
                                {reg.teamName || "Solo Registration"}
                              </p>
                              <p className="text-[10px] text-[var(--color-accent)] font-semibold">
                                Capt: {reg.playerName} ({reg.gamertag})
                              </p>
                            </td>
                            <td className="p-4">
                              <p className="font-mono">{reg.phone || "N/A"}</p>
                              <p className="text-[10px] text-gray-500">{reg.email}</p>
                            </td>
                            <td className="p-4">
                              {reg.uidScreenshot ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                                  Uploaded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                  Missing
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                  reg.paymentStatus === "VERIFIED"
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : reg.paymentStatus === "REJECTED"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                }`}
                              >
                                {reg.paymentStatus}
                              </span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                  reg.status === "CONFIRMED"
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : reg.status === "CANCELLED"
                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                }`}
                              >
                                {reg.status}
                              </span>
                            </td>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedReg(reg)}
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-all cursor-pointer"
                                  title="Inspect Roster & Proofs"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(reg.id)}
                                  className="p-1.5 rounded bg-red-500/5 hover:bg-red-500/15 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                  title="Delete Registration"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Room ID Generator */}
          {activeTab === "rooms" && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleGenerateRoom}>
                <GlowCard hover={false} className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-[var(--color-border)] pb-2 flex items-center gap-2 uppercase tracking-wide text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    <Key className="w-5 h-5 text-[var(--color-primary)]" /> Custom Room Credentials
                  </h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Room ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5819034"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Room Password</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. egpass12"
                      value={roomPassword}
                      onChange={(e) => setRoomPassword(e.target.value)}
                    />
                  </div>

                  {roomMsg && (
                    <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-primary-light)]">
                      {roomMsg}
                    </div>
                  )}

                  <NeonButton type="submit" variant="primary" className="w-full">
                    Publish Room Credentials
                  </NeonButton>
                </GlowCard>
              </form>
            </div>
          )}

          {/* Tab 3: Match Results */}
          {activeTab === "results" && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handlePostResult}>
                <GlowCard hover={false} className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-[var(--color-border)] pb-2 flex items-center gap-2 uppercase tracking-wide text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    <Trophy className="w-5 h-5 text-yellow-500" /> Post Match Result
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Winner Guild Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Total Gaming"
                      value={winnerGuild}
                      onChange={(e) => setWinnerGuild(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Runner-up Guild Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TSG Army"
                      value={runnerGuild}
                      onChange={(e) => setRunnerGuild(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Match Score</label>
                      <input
                        type="text"
                        required
                        value={matchScore}
                        onChange={(e) => setMatchScore(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Match MVP</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ritik (12 Kills)"
                        value={matchMvp}
                        onChange={(e) => setMatchMvp(e.target.value)}
                      />
                    </div>
                  </div>

                  {resultMsg && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400">
                      {resultMsg}
                    </div>
                  )}

                  <NeonButton type="submit" variant="primary" className="w-full">
                    Post Championship Results
                  </NeonButton>
                </GlowCard>
              </form>
            </div>
          )}

          {/* Tab 4: Active Season Config */}
          {activeTab === "season" && (
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSaveConfig}>
                <GlowCard hover={false} className="space-y-4">
                  <h3 className="text-lg font-bold border-b border-[var(--color-border)] pb-2 flex items-center gap-2 uppercase tracking-wide text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                    <Gamepad className="w-5 h-5 text-[var(--color-primary)]" /> GvG Season Config
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Tournament Title Name</label>
                    <input
                      type="text"
                      required
                      value={tourneyName}
                      onChange={(e) => setTourneyName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Prize Pool</label>
                      <input
                        type="text"
                        required
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Registration Status</label>
                      <select value={statusVal} onChange={(e) => setStatusVal(e.target.value)}>
                        <option value="OPEN">Registration Open</option>
                        <option value="CLOSED">Registration Closed / Live</option>
                        <option value="COMPLETED">Championship Ended</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Allowed Weapons List</label>
                      <input
                        type="text"
                        required
                        value={allowedWeapons}
                        onChange={(e) => setAllowedWeapons(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Match Schedule Time</label>
                      <input
                        type="text"
                        required
                        value={matchTime}
                        onChange={(e) => setMatchTime(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 uppercase font-semibold">Registration Deadline</label>
                      <input
                        type="text"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                      />
                    </div>
                  </div>

                  {configMsg && (
                    <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-primary-light)]">
                      {configMsg}
                    </div>
                  )}

                  <NeonButton type="submit" variant="primary" className="w-full">
                    Update Active Season Settings
                  </NeonButton>
                </GlowCard>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ DETAILED REGISTRATION INSPECTOR MODAL ═══════════════ */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--color-bg-deep)] border border-[var(--color-primary)]/40 rounded-3xl p-6 md:p-8 space-y-6 scrollbar-thin shadow-[0_0_50px_rgba(123,46,255,0.25)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReg(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Header */}
              <div className="border-b border-[var(--color-border)] pb-4 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Registration Inspector</span>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
                  {selectedReg.teamName || "Solo Player Registration"}
                </h2>
                <p className="text-xs text-gray-400 font-mono">ID: {selectedReg.id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left Column: Captain & Roster details */}
                <div className="md:col-span-7 space-y-6">
                  {/* Captain Card */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-primary-light)] flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Team Captain Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block uppercase font-semibold text-[10px]">Name</span>
                        <span className="text-white font-bold">{selectedReg.playerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase font-semibold text-[10px]">Gamertag</span>
                        <span className="text-white font-bold">{selectedReg.gamertag}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase font-semibold text-[10px]">Free Fire UID</span>
                        <span className="text-[var(--color-accent)] font-bold font-mono">{selectedReg.gameUID || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block uppercase font-semibold text-[10px]">WhatsApp Phone</span>
                        <span className="text-white font-bold font-mono">{selectedReg.phone || "N/A"}</span>
                      </div>
                      <div className="col-span-2 border-t border-white/5 pt-2">
                        <span className="text-gray-500 block uppercase font-semibold text-[10px]">Contact Email</span>
                        <span className="text-white font-bold font-mono">{selectedReg.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Roster Members Card */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-primary-light)] flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Squad Roster (4 Members)
                    </h3>
                    <div className="space-y-2 text-xs">
                      {selectedReg.teamMembers && selectedReg.teamMembers.length > 0 ? (
                        selectedReg.teamMembers.map((member: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-black/20 rounded border border-white/5">
                            <div>
                              <span className="text-gray-400 block text-[10px] font-semibold">Member #{idx + 1}</span>
                              <span className="text-white font-bold">{member.playerName}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[var(--color-accent)] block font-bold font-mono">{member.gamertag}</span>
                              <span className="text-gray-500 block font-mono text-[9px]">UID: {member.gameUID || "N/A"}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4 border border-dashed border-white/5 rounded-lg">
                          No roster members submitted.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Screenshots & Verification Details */}
                <div className="md:col-span-5 space-y-6">
                  {/* Screenshots Verification */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-primary-light)] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Screenshot Proofs
                    </h3>

                    {/* UID Proof Screenshot */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">UID Proof Screenshot</span>
                      {selectedReg.uidScreenshot ? (
                        <div className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 hover:border-[var(--color-accent)]/50 transition-all cursor-pointer">
                          <img
                            src={selectedReg.uidScreenshot}
                            alt="UID Verification Proof"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all"
                            onClick={() => setLightboxUrl(selectedReg.uidScreenshot)}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center border border-dashed border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-lg">
                          No UID screenshot submitted!
                        </div>
                      )}
                    </div>

                    {/* Payment Proof Screenshot */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">EasyPaisa/JazzCash Payment Receipt</span>
                      {selectedReg.paymentScreenshot ? (
                        <div className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer">
                          <img
                            src={selectedReg.paymentScreenshot}
                            alt="Payment Verification Receipt"
                            className="w-full h-full object-cover group-hover:scale-105 transition-all"
                            onClick={() => setLightboxUrl(selectedReg.paymentScreenshot)}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center border border-dashed border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-xs rounded-lg">
                          No payment receipt uploaded (Optional).
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Status controls */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">
                      Status Controls
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 uppercase block font-semibold text-[9px]">Payment Status</span>
                        <span className="text-white font-bold block">{selectedReg.paymentStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase block font-semibold text-[9px]">Lobby Status</span>
                        <span className="text-white font-bold block">{selectedReg.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      {selectedReg.status === "PENDING" && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleVerifyRegistration(selectedReg.id, true)}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                          >
                            <Check className="w-4 h-4" /> Verify & Confirm
                          </button>
                          <button
                            onClick={() => handleVerifyRegistration(selectedReg.id, false)}
                            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" /> Reject Team
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleDeleteRegistration(selectedReg.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 font-bold uppercase text-[10px] tracking-wider transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Roster Record
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════ LIGHTBOX SCREENSHOT VIEWER ═══════════════ */}
      <AnimatePresence>
        {lightboxUrl && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 cursor-zoom-out"
            onClick={() => setLightboxUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[90vh]"
            >
              <img
                src={lightboxUrl}
                alt="Full Size Verification Receipt"
                className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10"
              />
              <button
                onClick={() => setLightboxUrl(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/75 hover:bg-black text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
