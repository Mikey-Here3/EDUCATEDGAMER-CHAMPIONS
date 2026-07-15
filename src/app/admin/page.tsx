"use client";

import { useState, useEffect, startTransition } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { getTournaments, updateTournament } from "@/actions/tournament.actions";
import { getRegistrations, updatePaymentStatus, updateRegistrationStatus } from "@/actions/registration.actions";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NeonButton } from "@/components/shared/NeonButton";
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
} from "lucide-react";

// Mock Data for GvG Fallback
const mockActiveTournament = {
  id: "gvg-ff-cup-s4",
  name: "Educated Gamer Guild vs Guild Championship",
  game: "Free Fire",
  prizePool: "₹25,000",
  registeredCount: 36,
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
    phone: "+91 9876543210",
    teamName: "Team Soul",
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
    ],
  },
  {
    id: "reg-2",
    playerName: "Vikram Rathore",
    gamertag: "ViperYT",
    email: "vikram@gmail.com",
    phone: "+91 9876543211",
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
    ],
  },
];

export default function AdminPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "registrations" | "rooms" | "results" | "standings" | "season" | "content"
  >("registrations");

  // State Data
  const [activeTourney, setActiveTourney] = useState<any>(mockActiveTournament);
  const [registrations, setRegistrations] = useState<any[]>(mockRegistrations);

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

  // Load Real Data if Admin
  useEffect(() => {
    if (isAdmin) {
      getTournaments().then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          const current = res.data[0]; // Active season tournament is the latest one
          setActiveTourney(current);
          setTourneyName(current.name);
          setPrizePool(current.prizePool || "");
          setAllowedWeapons(current.rules || "");
          setStatusVal(current.status);

          getRegistrations(current.id).then((regRes) => {
            if (regRes.success && regRes.data) {
              setRegistrations(regRes.data);
            }
          });
        }
      });
    }
  }, [isAdmin]);

  // Handle Verify Registration Action
  const handleVerifyRegistration = async (id: string, approve: boolean) => {
    const statusVal = approve ? "CONFIRMED" : "CANCELLED";
    const paymentVal = approve ? "VERIFIED" : "REJECTED";

    if (id.startsWith("reg-")) {
      // Mock update
      setRegistrations(
        registrations.map((r) =>
          r.id === id ? { ...r, status: statusVal, paymentStatus: paymentVal } : r
        )
      );
      return;
    }

    // Real DB update
    const res = await updateRegistrationStatus(id, statusVal);
    if (res.success) {
      await updatePaymentStatus(id, paymentVal);
      setRegistrations(
        registrations.map((r) =>
          r.id === id ? { ...r, status: statusVal, paymentStatus: paymentVal } : r
        )
      );
    }
  };

  // Generate Room credentials
  const handleGenerateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setRoomMsg("");

    // Simulate Room credentials push to Captain WhatsApp/Discord
    setRoomMsg(`Room credentials generated and published. Room ID: ${roomId} | PW: ${roomPassword}`);
  };

  // Update Match Results
  const handlePostResult = (e: React.FormEvent) => {
    e.preventDefault();
    setResultMsg("");

    // Simulate saving results
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

    if (!isAdmin) {
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
      const res = await updateTournament(activeTourney.id, payload);
      if (res.success && res.data) {
        setActiveTourney(res.data);
        setConfigMsg("Database season settings updated successfully!");
      } else {
        setConfigMsg(res.message || "Failed to update configuration");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] pt-32 pb-20 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] text-xs font-bold uppercase tracking-wider mb-2 border border-[var(--color-primary)]/20">
              <Shield className="w-3.5 h-3.5" /> GvG Controller
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
              Admin Command Console
            </h1>
          </div>

          {!isAdmin && (
            <div className="glass-card px-4 py-2 border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs flex items-center gap-2 max-w-sm rounded-xl">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <p>Demo Mode active. Log in as Admin to write to Neon database.</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlowCard className="p-4 text-center" hover={false}>
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Active Season</p>
            <h4 className="text-lg font-bold text-white">Season 4 GvG</h4>
          </GlowCard>
          <GlowCard className="p-4 text-center" hover={false}>
            <Users className="w-6 h-6 text-[var(--color-accent)] mx-auto mb-2" />
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Applications</p>
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
          {/* Tab 1: Registrations */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-bold text-gray-400 uppercase">
                        <th className="p-4">Guild / Captain</th>
                        <th className="p-4">Roster Members</th>
                        <th className="p-4">WhatsApp Contact</th>
                        <th className="p-4">Screenshots</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)] text-sm">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            No team applications submitted.
                          </td>
                        </tr>
                      ) : (
                        registrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-[var(--color-surface)] transition-all">
                            <td className="p-4">
                              <p className="font-bold text-white">{reg.teamName || "Solo Player"}</p>
                              <p className="text-xs text-[var(--color-accent)]">Captain: {reg.playerName} ({reg.gamertag})</p>
                              <p className="text-[10px] text-gray-500 font-mono">UID: {reg.gameUID}</p>
                            </td>
                            <td className="p-4">
                              <div className="text-xs space-y-0.5 text-gray-300">
                                {reg.teamMembers && reg.teamMembers.length > 0 ? (
                                  reg.teamMembers.map((m: any, idx: number) => (
                                    <div key={idx} className="truncate max-w-[180px]">
                                      • {m.playerName} ({m.gamertag})
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-gray-500">No extra members</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-xs font-mono">{reg.phone}</p>
                              <p className="text-[10px] text-gray-500">{reg.email}</p>
                            </td>
                            <td className="p-4 space-y-1">
                              {reg.uidScreenshot ? (
                                <a
                                  href={reg.uidScreenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[10px] text-[var(--color-accent)] hover:underline"
                                >
                                  <Eye className="w-3 h-3" /> View UID Screenshot
                                </a>
                              ) : (
                                <p className="text-[10px] text-red-500">UID Missing</p>
                              )}
                              {reg.paymentScreenshot && (
                                <a
                                  href={reg.paymentScreenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[10px] text-yellow-500 hover:underline"
                                >
                                  <Eye className="w-3 h-3" /> View Payment Proof
                                </a>
                              )}
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
                            <td className="p-4 text-center">
                              {reg.status === "PENDING" ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleVerifyRegistration(reg.id, true)}
                                    className="p-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 transition-all cursor-pointer"
                                    title="Verify & Confirm"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleVerifyRegistration(reg.id, false)}
                                    className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer"
                                    title="Reject Application"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">-</span>
                              )}
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
    </div>
  );
}
