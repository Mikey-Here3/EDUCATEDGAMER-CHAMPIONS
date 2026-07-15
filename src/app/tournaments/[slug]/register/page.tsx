import Link from "next/link";
import { getTournamentBySlug } from "@/actions/tournament.actions";
import { RegisterForm } from "./RegisterForm";
import { ArrowLeft } from "lucide-react";
import { NeonButton } from "@/components/shared/NeonButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RegisterPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Try to fetch from DB using the Server Action
  const response = await getTournamentBySlug(slug);
  let tournament = response.success && response.data ? response.data : null;

  // Fallback mock data if DB is not seeded or database connection is offline
  if (!tournament) {
    const mockTournaments: Record<string, any> = {
      "br-ff-cup-s4": {
        id: "br-ff-cup-s4-id",
        slug: "br-ff-cup-s4",
        name: "Educated Gamer 5000 Diamonds Championship",
        game: "Free Fire",
        type: "SQUAD",
        entryFee: 0,
        prizePool: "5,000 Diamonds",
        maxSlots: 48,
        registeredCount: 28,
      },
    };
    tournament = mockTournaments[slug] || null;
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-deep)] text-white px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-orbitron)" }}>
            Tournament Not Found
          </h1>
          <p className="text-gray-400 mb-6">The tournament you are looking to register for does not exist.</p>
          <Link href="/tournaments">
            <NeonButton variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments
            </NeonButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)] pt-32 pb-20 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(123,46,255,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link
          href={`/tournaments/${slug}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--color-primary-light)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to details
        </Link>

        <div className="mb-10 text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] text-xs font-semibold uppercase tracking-wider mb-3">
            Registration Form
          </span>
          <h1
            className="text-3xl md:text-5xl font-black gradient-text uppercase tracking-tight"
            style={{ fontFamily: "var(--font-orbitron)" }}
          >
            {tournament.name}
          </h1>
          <p className="text-gray-400 mt-2">
            Fill out the details below to secure your spot. Mode:{" "}
            <span className="text-[var(--color-accent)] font-semibold">{tournament.type}</span>
          </p>
        </div>

        <RegisterForm tournament={tournament} />
      </div>
    </div>
  );
}
