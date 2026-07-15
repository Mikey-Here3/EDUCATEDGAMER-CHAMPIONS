"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, User, LogIn, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#hero", label: "Home" },
  { href: "/#tournament", label: "Tournament" },
  { href: "/#rules", label: "Rules" },
  { href: "/#leaderboard", label: "Leaderboard" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#results", label: "Results" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-bg-primary/80 backdrop-blur-2xl border-b border-glass-border shadow-lg shadow-black/20 py-3"
            : "bg-transparent py-5"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-[var(--shadow-neon-sm)] group-hover:shadow-[var(--shadow-neon-md)] transition-shadow duration-300">
                  <span className="font-[family-name:var(--font-orbitron)] font-black text-white text-sm">
                    EG
                  </span>
                </div>
              </div>
              <span className="font-[family-name:var(--font-orbitron)] text-base sm:text-lg font-bold tracking-wider neon-text hidden sm:block">
                EDUCATED GAMER
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                      isActive
                        ? "text-primary-400"
                        : "text-text-secondary hover:text-white"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary-500 rounded-full"
                        layoutId="activeNavLink"
                        style={{
                          boxShadow: "0 0 8px rgba(123, 46, 255, 0.6)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Auth + Mobile Toggle */}
            <div className="flex items-center gap-3">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-glass border border-glass-border hover:border-glass-hover transition-all duration-300"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-7 h-7 rounded-full border border-primary-500/30"
                    />
                  ) : (
                    <User className="w-5 h-5 text-primary-400" />
                  )}
                  <span className="text-sm text-text-secondary">
                    {session.user.name?.split(" ")[0] || "Player"}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium hover:bg-primary-500/20 hover:border-primary-400 transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-glass transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom glow line */}
        {isScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px] glow-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-bg-secondary/95 backdrop-blur-2xl border-l border-glass-border z-50 md:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-glass-border">
                <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold neon-text">
                  MENU
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-glass transition-colors"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary-500/15 text-primary-400 border border-primary-500/20"
                            : "text-text-secondary hover:text-white hover:bg-glass"
                        )}
                      >
                        {link.label}
                        <ChevronRight className="w-4 h-4 opacity-40" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="px-4 pb-6">
                {session?.user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-glass border border-glass-border"
                  >
                    <User className="w-5 h-5 text-primary-400" />
                    <span className="text-sm">
                      {session.user.name || "Player"}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-semibold shadow-[var(--shadow-neon-sm)]"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
