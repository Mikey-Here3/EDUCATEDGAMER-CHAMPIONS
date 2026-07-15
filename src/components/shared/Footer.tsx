import Link from "next/link";
import {
  Gamepad2,
  MessageCircle,
  Trophy,
  ScrollText,
  Info,
  ExternalLink,
} from "lucide-react";

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

const quickLinks = [
  { href: "/#tournament", label: "Tournament", icon: Trophy },
  { href: "/#rules", label: "Rules", icon: ScrollText },
  { href: "/#leaderboard", label: "Leaderboard", icon: Gamepad2 },
];

const communityLinks = [
  {
    href: "https://chat.whatsapp.com/FNAfIjgLAo64IwNSRyy7OB",
    label: "WhatsApp",
    icon: MessageCircle,
    color: "hover:text-[#25D366]",
  },
  {
    href: "https://discord.gg/educatedgamer3",
    label: "Discord",
    icon: MessageCircle,
    color: "hover:text-[#5865F2]",
  },
  {
    href: "https://www.youtube.com/@EducatedGamer3",
    label: "YouTube",
    icon: Youtube,
    color: "hover:text-[#FF0000]",
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-glass-border bg-bg-secondary/50 backdrop-blur-sm">
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] glow-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="font-[family-name:var(--font-orbitron)] font-black text-white text-xs">
                  EG
                </span>
              </div>
              <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-wider neon-text">
                EDUCATED GAMER
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Official Free Fire Tournament Organizer. Compete with top Guilds, win prize pools, and join our active YouTube streaming community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-[family-name:var(--font-orbitron)] text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Tournament Sections
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-text-muted text-sm hover:text-primary-400 transition-colors duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-[family-name:var(--font-orbitron)] text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Social Links
            </h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-text-muted text-sm transition-colors duration-200 ${link.color}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © 2026 Educated Gamer. All rights reserved.
          </p>
          <p className="text-text-muted/60 text-xs">
            Official Free Fire Tournament Organizers
          </p>
        </div>
      </div>
    </footer>
  );
}
