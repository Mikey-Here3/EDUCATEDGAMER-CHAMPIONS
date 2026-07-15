"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { registerForTournament } from "@/actions/registration.actions";
import { GlowCard } from "@/components/shared/GlowCard";
import { NeonButton } from "@/components/shared/NeonButton";
import {
  User,
  Users,
  Mail,
  Phone,
  Shield,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  LogIn,
  DollarSign,
} from "lucide-react";

interface RegisterFormProps {
  tournament: {
    id: string;
    slug: string;
    name: string;
    game: string;
    type: "SOLO" | "SQUAD" | "BOTH";
    entryFee: number;
    prizePool: string | null;
  };
}

export function RegisterForm({ tournament }: RegisterFormProps) {
  const { data: session, status } = useSession();
  
  // Registration States (Captain / Leader)
  const [playerName, setPlayerName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [gamertag, setGamertag] = useState("");
  const [gameUID, setGameUID] = useState("");
  
  // Guild Name
  const [teamName, setTeamName] = useState("");
  
  // Roster (Free Fire Team Members: Min 1, Max 5)
  const [squadMembers, setSquadMembers] = useState<
    { playerName: string; gamertag: string; gameUID: string }[]
  >([
    { playerName: "", gamertag: "", gameUID: "" },
    { playerName: "", gamertag: "", gameUID: "" },
    { playerName: "", gamertag: "", gameUID: "" },
  ]);

  // General Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  // Screenshots
  const [uidScreenshot, setUidScreenshot] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const handleAddMember = () => {
    if (squadMembers.length >= 5) return;
    setSquadMembers([...squadMembers, { playerName: "", gamertag: "", gameUID: "" }]);
  };

  const handleRemoveMember = (index: number) => {
    const updated = [...squadMembers];
    updated.splice(index, 1);
    setSquadMembers(updated);
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const updated = [...squadMembers];
    updated[index] = { ...updated[index], [field]: value };
    setSquadMembers(updated);
  };

  // Read image files as base64 string to store persistently in Neon PostgreSQL database
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>, type: "uid" | "payment") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        setErrorMsg("Screenshot size must be less than 2.5MB for database storage.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === "uid") {
          setUidScreenshot(base64String);
        } else {
          setPaymentScreenshot(base64String);
        }
        setErrorMsg("");
      };
      reader.onerror = () => {
        setErrorMsg("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    if (!uidScreenshot) {
      setErrorMsg("UID verification screenshot is required.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      type: "SQUAD" as const, // GvG is always a team roster squad registration
      tournamentId: tournament.id,
      teamName,
      playerName,
      email,
      phone,
      gamertag,
      gameUID,
      uidScreenshot,
      paymentScreenshot: paymentScreenshot || undefined,
      teamMembers: squadMembers.filter(
        (m) => m.playerName.trim() || m.gamertag.trim() || m.gameUID.trim()
      ),
    };

    try {
      const res = await registerForTournament(payload);
      if (res.success) {
        setSuccessData(res.data);
      } else {
        setErrorMsg(res.message);
        if (res.errors) {
          setFieldErrors(res.errors);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <GlowCard className="p-8 md:p-12 border-green-500/30">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider text-green-400"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Guild Applied!
          </h2>
          <p className="text-gray-300 max-w-md mx-auto mb-8">
            Your Guild roster for <span className="font-bold text-white">{tournament.name}</span> has been received. 
            Once our admins verify your UID screenshot and payment details, your registration status will update to Verified.
          </p>

          <div className="max-w-md mx-auto bg-black/40 border border-[var(--color-border)] rounded-xl p-6 text-left space-y-4 mb-8">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wide" style={{ fontFamily: "var(--font-orbitron)" }}>
              <Shield className="w-4 h-4 text-[var(--color-primary)]" /> Roster Details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span className="text-gray-500">Guild Name:</span>
              <span className="text-white font-medium">{teamName}</span>
              <span className="text-gray-500">Captain:</span>
              <span className="text-white font-medium">{playerName} ({gamertag})</span>
              <span className="text-gray-500">Captain UID:</span>
              <span className="text-white font-mono">{gameUID}</span>
              <span className="text-gray-500">WhatsApp:</span>
              <span className="text-white font-medium">{phone}</span>
              <span className="text-gray-500">Roster Count:</span>
              <span className="text-white font-medium">{squadMembers.length + 1} Players</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NeonButton href="/" variant="outline">
              Back to Home
            </NeonButton>
            <NeonButton href="/#tournament" variant="primary">
              Match Timings
            </NeonButton>
          </div>
        </GlowCard>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Auth Promotion Banner */}
      {status === "unauthenticated" && (
        <GlowCard hover={false} className="border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center flex-shrink-0">
                <LogIn className="w-5 h-5 text-[var(--color-primary-light)]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Register faster with Google</h4>
                <p className="text-xs text-gray-400">Log in to auto-fill captain email details and sync notifications.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="px-4 py-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white text-xs font-semibold rounded-lg hover:shadow-[0_0_15px_var(--color-primary-glow)] transition-all cursor-pointer whitespace-nowrap"
            >
              Sign In with Google
            </button>
          </div>
        </GlowCard>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guild details */}
        <GlowCard hover={false} className="space-y-6">
          <h3
            className="text-lg font-bold border-b border-[var(--color-border)] pb-3 flex items-center gap-2 uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <Users className="w-5 h-5 text-[var(--color-primary)]" />
            Guild Captain Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs text-gray-400 uppercase font-semibold">Guild Name</label>
              <input
                type="text"
                required
                placeholder="Enter official Free Fire Guild Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              {fieldErrors.teamName && (
                <p className="text-red-500 text-xs">{fieldErrors.teamName[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase font-semibold">Captain Name</label>
              <input
                type="text"
                required
                placeholder="Captain full name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              {fieldErrors.playerName && (
                <p className="text-red-500 text-xs">{fieldErrors.playerName[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase font-semibold">Captain Nickname</label>
              <input
                type="text"
                required
                placeholder="In-game Name / Nickname"
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
              />
              {fieldErrors.gamertag && (
                <p className="text-red-500 text-xs">{fieldErrors.gamertag[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase font-semibold">Captain UID</label>
              <input
                type="text"
                required
                placeholder="In-game character UID"
                value={gameUID}
                onChange={(e) => setGameUID(e.target.value)}
              />
              {fieldErrors.gameUID && (
                <p className="text-red-500 text-xs">{fieldErrors.gameUID[0]}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 uppercase font-semibold">Captain Email</label>
              <input
                type="email"
                required
                placeholder="Email address for notifications"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs text-gray-400 uppercase font-semibold">Captain WhatsApp Number</label>
              <input
                type="tel"
                required
                placeholder="Contact WhatsApp number (with country code)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {fieldErrors.phone && (
                <p className="text-red-500 text-xs">{fieldErrors.phone[0]}</p>
              )}
            </div>
          </div>
        </GlowCard>

        {/* Guild Members Roster */}
        <GlowCard hover={false} className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h3
              className="text-lg font-bold flex items-center gap-2 uppercase text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              <Users className="w-5 h-5 text-[var(--color-primary)]" />
              Guild Roster
            </h3>
            <button
              type="button"
              onClick={handleAddMember}
              disabled={squadMembers.length >= 5}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] text-xs font-semibold rounded-lg hover:bg-[var(--color-primary)]/20 transition-all border border-[var(--color-primary)]/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Player ({squadMembers.length + 1}/6)
            </button>
          </div>

          <div className="space-y-4">
            {squadMembers.map((member, index) => (
              <div
                key={index}
                className="p-4 bg-black/30 border border-[var(--color-border)] rounded-xl relative space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--color-primary-light)] uppercase tracking-wide">
                    Guild Member #{index + 2}
                  </span>
                  {squadMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Player Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Real name"
                      value={member.playerName}
                      onChange={(e) =>
                        handleMemberChange(index, "playerName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">Nickname</label>
                    <input
                      type="text"
                      required
                      placeholder="In-game Name"
                      value={member.gamertag}
                      onChange={(e) =>
                        handleMemberChange(index, "gamertag", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase font-semibold">UID</label>
                    <input
                      type="text"
                      required
                      placeholder="In-game UID"
                      value={member.gameUID}
                      onChange={(e) =>
                        handleMemberChange(index, "gameUID", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlowCard>

        {/* Payment Instructions Card */}
        <GlowCard hover={false} className="space-y-4">
          <h3
            className="text-lg font-bold border-b border-[var(--color-border)] pb-3 flex items-center gap-2 uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <DollarSign className="w-5 h-5 text-[var(--color-primary)]" /> Payment Instructions
          </h3>
          <div className="p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl space-y-3">
            <p className="text-xs text-gray-300 leading-relaxed">
              The entry fee for this tournament is <span className="text-white font-bold">400 PKR</span> for the entire team of 5 members. Please send the payment to the mobile wallet or bank details below and upload your transaction screenshot (optional).
            </p>
            <div className="text-xs grid grid-cols-2 gap-2 bg-black/40 p-3 rounded-lg border border-[var(--color-border)] max-w-sm">
              <span className="text-gray-500">EasyPaisa:</span>
              <span className="text-white font-semibold font-mono">0300 1234567</span>
              <span className="text-gray-500">JazzCash:</span>
              <span className="text-white font-semibold font-mono">0315 7654321</span>
              <span className="text-gray-500">Bank Transfer:</span>
              <span className="text-white font-semibold">Alfalah Bank (Acct: 908123-1)</span>
            </div>
          </div>
        </GlowCard>

        {/* Verification Screenshots Card */}
        <GlowCard hover={false} className="space-y-6">
          <h3
            className="text-lg font-bold border-b border-[var(--color-border)] pb-3 flex items-center gap-2 uppercase text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            <Upload className="w-5 h-5 text-[var(--color-primary)]" /> Screenshot Verifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UID Screenshot */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Captain UID Screenshot (Required)</label>
              <div className="flex items-center justify-center w-full">
                {uidScreenshot ? (
                  <div className="flex flex-col items-center justify-center w-full h-32 border border-[var(--color-primary)]/20 rounded-xl bg-black/40 p-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={uidScreenshot}
                        className="w-16 h-10 object-cover rounded border border-white/10 hover:scale-105 cursor-pointer transition-all"
                        alt="UID Proof attached"
                        onClick={(e) => {
                          e.preventDefault();
                          setLightboxUrl(uidScreenshot);
                        }}
                      />
                      <div className="text-left">
                        <span className="text-xs text-green-400 font-semibold block">UID Proof attached</span>
                        <button
                          type="button"
                          onClick={() => setLightboxUrl(uidScreenshot)}
                          className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                        >
                          Click to Preview
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUidScreenshot("")}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Remove & Upload Different
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-all bg-black/20 hover:bg-black/40">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <Upload className="w-6 h-6 text-gray-500 mb-2 mx-auto" />
                      <p className="text-xs text-gray-400 font-medium">Attach captain in-game profile screenshot</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleScreenshotChange(e, "uid")}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Payment Screenshot */}
            <div className="space-y-3">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Entry Fee Proof (Optional)</label>
              <div className="flex items-center justify-center w-full">
                {paymentScreenshot ? (
                  <div className="flex flex-col items-center justify-center w-full h-32 border border-[var(--color-primary)]/20 rounded-xl bg-black/40 p-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={paymentScreenshot}
                        className="w-16 h-10 object-cover rounded border border-white/10 hover:scale-105 cursor-pointer transition-all"
                        alt="Payment Proof attached"
                        onClick={(e) => {
                          e.preventDefault();
                          setLightboxUrl(paymentScreenshot);
                        }}
                      />
                      <div className="text-left">
                        <span className="text-xs text-green-400 font-semibold block">Payment Proof attached</span>
                        <button
                          type="button"
                          onClick={() => setLightboxUrl(paymentScreenshot)}
                          className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
                        >
                          Click to Preview
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPaymentScreenshot("")}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Remove & Upload Different
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border)] rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-all bg-black/20 hover:bg-black/40">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <Upload className="w-6 h-6 text-gray-500 mb-2 mx-auto" />
                      <p className="text-xs text-gray-400 font-medium">Attach transaction screenshot (if applicable)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleScreenshotChange(e, "payment")}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Global & Field validation errors */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex flex-col gap-2 text-red-400 text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-bold">{errorMsg}</p>
            </div>
            {Object.keys(fieldErrors).length > 0 && (
              <ul className="list-disc list-inside pl-8 text-xs space-y-1 text-red-300">
                {Object.entries(fieldErrors).map(([field, errors]) => {
                  // Format field name for better readability
                  let label = field;
                  if (field.startsWith("teamMembers.")) {
                    const index = parseInt(field.split(".")[1], 10);
                    const memberField = field.split(".")[2];
                    label = `Player #${index + 2} (${memberField === "playerName" ? "Name" : memberField === "gamertag" ? "Nickname" : "UID"})`;
                  } else if (field === "teamName") {
                    label = "Guild Name";
                  } else if (field === "playerName") {
                    label = "Captain Name";
                  } else if (field === "gamertag") {
                    label = "Captain Nickname";
                  } else if (field === "gameUID") {
                    label = "Captain UID";
                  } else if (field === "phone") {
                    label = "WhatsApp Number";
                  } else if (field === "email") {
                    label = "Email Address";
                  }
                  
                  return (
                    <li key={field}>
                      <span className="font-semibold uppercase tracking-wider">{label}</span>: {errors[0]}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Submit */}
        <NeonButton
          type="submit"
          variant="primary"
          size="lg"
          className="w-full text-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Submitting Guild Application..."
          ) : (
            <>
              Confirm Guild Roster Registration
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </NeonButton>
      </form>

      {/* Lightbox image zoom preview modal */}
      <AnimatePresence>
        {lightboxUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 cursor-zoom-out"
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
                alt="Full Size Verification"
                className="max-w-full max-h-[90vh] object-contain rounded-lg border border-white/10"
              />
              <button
                onClick={() => setLightboxUrl(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/75 hover:bg-black text-white cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
