import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Providers } from "@/components/providers/Providers";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Educated Gamer | Premium Esports Tournament Platform",
  description:
    "Join the ultimate esports tournament platform. Register for tournaments, build your team, and compete for glory. PUBG Mobile, Free Fire, Valorant & more.",
  keywords: [
    "esports",
    "tournament",
    "gaming",
    "PUBG Mobile",
    "Free Fire",
    "Valorant",
    "competitive gaming",
    "esports platform",
  ],
  openGraph: {
    title: "Educated Gamer | Where Champions Are Made",
    description: "Premium esports tournament platform for competitive gamers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${inter.variable} antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
