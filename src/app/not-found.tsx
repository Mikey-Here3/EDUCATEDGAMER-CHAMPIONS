"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { NeonButton } from "@/components/shared/NeonButton";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030014] text-white relative overflow-hidden px-4">
      <ParticleBackground />

      <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.2)] border border-red-500/20"
        >
          <AlertCircle className="w-10 h-10 text-red-500" />
        </motion.div>

        <div className="space-y-2">
          <h1
            className="text-6xl md:text-8xl font-black text-red-500 tracking-tight neon-text"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            404
          </h1>
          <h2
            className="text-xl font-bold uppercase tracking-wider text-white"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            Security breach: Page Lost
          </h2>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">
            The page you are trying to access has been deleted, moved, or never existed in this sector.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <Link href="/">
            <NeonButton variant="primary">
              <ArrowLeft className="w-4 h-4" /> Go Back Home
            </NeonButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
