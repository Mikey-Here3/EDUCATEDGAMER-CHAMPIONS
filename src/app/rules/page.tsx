"use client";

import { motion } from "motion/react";
import { GlowCard } from "@/components/shared/GlowCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { Shield, Swords, Users, Calendar, Award, AlertTriangle } from "lucide-react";

const ruleSections = [
  {
    icon: Shield,
    title: "General Rules",
    rules: [
      "All participants must register using their official in-game tags and character UIDs.",
      "Players must join the official Discord/WhatsApp groups to receive match lobby codes.",
      "Lobby credentials will be shared 15 minutes before the scheduled match time.",
      "Match start times are strict. Teams that are not fully present in the lobby within 5 minutes of start will be disqualified.",
    ],
  },
  {
    icon: Swords,
    title: "Tournament Format",
    rules: [
      "Battle Royale matches are held on standard official maps (e.g. Erangel, Bermuda).",
      "Points scoring: placement points (based on final position) + kill points (1 point per kill).",
      "Ties will be broken by: 1) total kill points, 2) total number of wins, 3) placement in the final match.",
      "Squad sizes must match the tournament mode (Solo or Squad of 4). Modifying rosters after registration starts is forbidden unless approved by admins.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Fair Play Policy",
    rules: [
      "Use of emulators, triggers, hacks, exploits, or third-party modifications is strictly banned.",
      "Teaming up with opponents, match-fixing, or stream sniping will lead to immediate disqualification and permanent platform ban.",
      "Organizers reserve the right to request real-time gameplay recordings/hand-cams in case of suspicious reports.",
    ],
  },
  {
    icon: Award,
    title: "Prize Distribution",
    rules: [
      "Prizes will be sent directly to the Captain's registered payment details within 3-5 business days after matches conclude.",
      "Tax deductions and transfer fees, if applicable, are deducted from the prize pool.",
      "Winners must verify their identity by providing screenshot of their profile dashboard and registration ID.",
    ],
  },
];

export default function RulesPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bg-deep)] z-10" />
        <div className="relative z-20 text-center px-4">
          <SectionHeading
            title="Rules & Regulations"
            subtitle="Understand our guidelines to ensure fair, competitive, and fun tournaments."
          />
        </div>
      </section>

      <section className="pb-20 px-4 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {ruleSections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlowCard hover={false} className="p-6">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 border border-[var(--color-primary)]/20">
                        <section.icon className="w-5 h-5 text-[var(--color-primary-light)]" />
                      </div>
                      <h3
                        className="text-lg font-bold tracking-wide text-white group-hover:text-[var(--color-primary-light)] transition-colors"
                        style={{ fontFamily: "var(--font-orbitron)" }}
                      >
                        {section.title}
                      </h3>
                    </div>
                    <span className="ml-1.5 flex-shrink-0 rounded-full bg-black/40 p-1.5 text-gray-400 group-open:rotate-180 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>

                  <div className="mt-4 border-t border-[var(--color-border)] pt-4 space-y-3">
                    {section.rules.map((rule, ruleIdx) => (
                      <div key={ruleIdx} className="flex items-start gap-3 text-sm text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[var(--color-border)]">
                          <span className="text-xs text-[var(--color-primary-light)] font-semibold">
                            {ruleIdx + 1}
                          </span>
                        </span>
                        <p className="leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
