"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import Link from "next/link";
import { getMyRegistrations } from "@/actions/registration.actions";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NeonButton } from "@/components/shared/NeonButton";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import {
  Trophy,
  Users,
  Calendar,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user registrations once logged in
  useEffect(() => {
    if (session?.user?.id) {
      getMyRegistrations(session.user.id)
        .then((res) => {
          if (res.success && res.data) {
            setRegistrations(res.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  // Loading Screen
  if (status === "loading" || loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#030014] px-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // Not Logged In
  if (!session) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#030014] px-4 overflow-hidden">
        <ParticleBackground />
        
        {/* Lightning Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(123,46,255,0.02)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

        <div className="relative z-20 w-full max-w-md">
          <GlowCard hover={false} className="p-8 text-center space-y-6 border-[var(--color-primary)]/20 bg-black/60 backdrop-blur-xl">
            <Shield className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                Access Denied
              </h2>
              <p className="text-xs text-gray-400">
                You must be logged in to view your player profile and roster registration status.
              </p>
            </div>
            <Link href="/login" className="w-full block">
              <NeonButton variant="primary" size="md" className="w-full">
                Go to Sign In
              </NeonButton>
            </Link>
          </GlowCard>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#030014] pt-32 pb-20 px-4 overflow-hidden">
      <ParticleBackground />

      {/* Lightning Overlay Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(123,46,255,0.02)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

      <div className="relative z-20 max-w-4xl mx-auto space-y-10">
        
        {/* Header Profile Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[var(--color-border)] pb-8">
          <div className="flex items-center gap-4 text-center md:text-left">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)] shadow-[0_0_20px_rgba(123,46,255,0.4)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 flex items-center justify-center text-white font-black text-xl">
                {session.user.name?.charAt(0).toUpperCase() || "P"}
              </div>
            )}
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[9px] font-bold text-[var(--color-primary-light)] uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3" /> Player Profile
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white" style={{ fontFamily: "var(--font-orbitron)" }}>
                {session.user.name}
              </h1>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {session.user.role === "ADMIN" && (
              <Link href="/admin">
                <NeonButton variant="outline" size="sm">
                  Admin Panel
                </NeonButton>
              </Link>
            )}
            <Link href="/tournaments/br-ff-cup-s4/register">
              <NeonButton variant="primary" size="sm">
                Register New Team
              </NeonButton>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <SectionHeading title="Active Registrations" subtitle="Track your roster applications, payment checks, and lobby statuses." />

          {registrations.length === 0 ? (
            <GlowCard hover={false} className="p-8 text-center space-y-4 border-dashed border-[var(--color-border)] bg-black/25">
              <AlertCircle className="w-10 h-10 text-gray-500 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-white">No active registrations found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  You haven't submitted any team rosters for the active Season 4 tournament yet. Slots are filling up fast!
                </p>
              </div>
              <Link href="/tournaments/br-ff-cup-s4/register" className="inline-block pt-2">
                <NeonButton variant="primary" size="md">
                  Register Your Guild Team
                </NeonButton>
              </Link>
            </GlowCard>
          ) : (
            <div className="space-y-6">
              {registrations.map((reg) => (
                <GlowCard key={reg.id} hover={false} className="p-6 md:p-8 space-y-6 border-[var(--color-border)] bg-black/40">
                  
                  {/* Status Banner */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Guild Name</p>
                      <h2 className="text-xl md:text-2xl font-black text-white uppercase" style={{ fontFamily: "var(--font-orbitron)" }}>
                        {reg.teamName || "Solo Registration"}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono hidden md:inline">Status:</span>
                      <span
                        className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded border ${
                          reg.status === "CONFIRMED"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : reg.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Captain & Members Info */}
                    <div className="md:col-span-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Team Captain</span>
                          <span className="text-xs text-white font-bold">{reg.playerName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Captain UID</span>
                          <span className="text-xs text-[var(--color-accent)] font-bold font-mono">{reg.gameUID || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">WhatsApp Contact</span>
                          <span className="text-xs text-white font-bold font-mono">{reg.phone || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-semibold block">Registered On</span>
                          <span className="text-xs text-white font-bold font-mono">
                            {new Date(reg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Roster list */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5" style={{ fontFamily: "var(--font-orbitron)" }}>
                          <Users className="w-4 h-4 text-[var(--color-primary-light)]" /> Squad Roster
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {reg.teamMembers && reg.teamMembers.length > 0 ? (
                            reg.teamMembers.map((member: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center p-2.5 bg-black/20 rounded border border-white/5">
                                <span className="text-gray-400 font-bold">{member.playerName}</span>
                                <span className="text-[var(--color-accent)] font-mono font-bold">{member.gamertag} (UID: {member.gameUID})</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 italic col-span-2">No extra squad members recorded.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right column: Next steps guide */}
                    <div className="md:col-span-4 p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5" style={{ fontFamily: "var(--font-orbitron)" }}>
                          <Clock className="w-4 h-4 text-yellow-500" /> Verification Status
                        </h4>

                        {reg.status === "PENDING" ? (
                          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                            <p className="text-yellow-500 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 flex-shrink-0" /> Awaiting Verification
                            </p>
                            <p>
                              Our moderators are currently verifying your EasyPaisa / JazzCash payment proof screenshot.
                            </p>
                            <p>
                              If verified, your status will become **CONFIRMED** and you will receive access credentials.
                            </p>
                          </div>
                        ) : reg.status === "CONFIRMED" ? (
                          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                            <p className="text-green-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Slot Verified & Confirmed!
                            </p>
                            <p>
                              Booyah! Your roster is locked in for Season 4. 
                            </p>
                            <p>
                              Please ensure your captain remains active in our official WhatsApp group. Room ID & Password details will release 15 mins before match start.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                            <p className="text-red-400 font-semibold flex items-center gap-1">
                              <XCircle className="w-4 h-4 flex-shrink-0" /> Application Cancelled
                            </p>
                            <p>
                              This registration has been cancelled or rejected due to transaction verification failures.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Community Button */}
                      <a
                        href="https://chat.whatsapp.com/FNAfIjgLAo64IwNSRyy7OB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer text-center"
                      >
                        <MessageCircle className="w-4 h-4" /> Join Captain's WhatsApp Group
                      </a>
                    </div>
                  </div>

                </GlowCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
