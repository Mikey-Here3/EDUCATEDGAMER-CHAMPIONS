"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Key, User } from "lucide-react";
import Link from "next/link";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { GlowCard } from "@/components/shared/GlowCard";
import { NeonButton } from "@/components/shared/NeonButton";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const correctUsername = "admin";
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "educatedgamer3admin";

    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem("eg_admin_passcode", password);
      // Redirect to admin panel
      window.location.href = "/admin";
    } else {
      setError("Invalid admin username or passcode.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#030014] px-4 overflow-hidden">
      <ParticleBackground />

      {/* Lightning Overlay Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(123,46,255,0.02)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

      {/* Floating Ambient Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[var(--color-primary)]/10 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-20 w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Login Card */}
        <GlowCard hover={false} className="p-8 text-center space-y-6 border-[var(--color-primary)]/20 bg-black/60 backdrop-blur-xl">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 rounded bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40 text-[9px] font-black text-white tracking-widest uppercase">
              {isAdminMode ? "EG Command Portal" : "EG Player Portal"}
            </span>
            <h2
              className="text-3xl font-black italic tracking-tighter text-white"
              style={{ fontFamily: "var(--font-orbitron)" }}
            >
              EDUCATED <span className="text-[var(--color-primary-light)]">GAMER</span>
            </h2>
            <p className="text-xs text-gray-400">
              {isAdminMode
                ? "Enter administrator command credentials to gain authorization."
                : "Sign in to register rosters, track squad status, and claim giveaways."}
            </p>
          </div>

          {!isAdminMode ? (
            /* PLAYER SIGN IN OPTIONS */
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google", { callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 bg-white text-black font-black uppercase text-xs tracking-wider py-4 px-6 rounded-xl hover:bg-gray-100 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.15)] cursor-pointer"
              >
                <GoogleIcon />
                Continue with Google
              </motion.button>
              
              <div className="border-t border-white/5 pt-4">
                <button
                  onClick={() => setIsAdminMode(true)}
                  className="text-xs text-gray-500 hover:text-[var(--color-primary-light)] transition-colors flex items-center gap-1.5 mx-auto font-semibold uppercase tracking-wider cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> Access Admin Console
                </button>
              </div>

              <div className="text-[10px] text-gray-500 leading-relaxed max-w-xs mx-auto">
                By signing in, you agree to our fair play terms. Double-tap configs, emulator scripts, and macros are strictly monitored.
              </div>
            </div>
          ) : (
            /* ADMIN SIGN IN FORM */
            <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black pl-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-[var(--color-primary-light)]" /> Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black pl-1 flex items-center gap-1">
                  <Key className="w-3 h-3 text-[var(--color-primary-light)]" /> Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 font-bold text-center">{error}</p>
              )}

              <div className="space-y-3 pt-2">
                <NeonButton type="submit" variant="primary" className="w-full uppercase text-xs tracking-wider">
                  Unlock Admin Console
                </NeonButton>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminMode(false);
                    setError("");
                  }}
                  className="w-full text-center text-xs text-gray-500 hover:text-white uppercase font-bold tracking-wider py-1 cursor-pointer"
                >
                  Go Back to Player Login
                </button>
              </div>
            </form>
          )}
        </GlowCard>
      </div>
    </div>
  );
}
