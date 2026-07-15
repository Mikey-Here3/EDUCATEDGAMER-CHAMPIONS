const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const slug = "br-ff-cup-s4";

  // Check if tournament already exists
  const existing = await prisma.tournament.findUnique({
    where: { slug },
  });

  if (existing) {
    console.log(`Tournament with slug "${slug}" already exists in the database.`);
    return;
  }

  // Create the Free Fire 5000 Diamonds Season 4 Tournament
  const tournament = await prisma.tournament.create({
    data: {
      id: "br-ff-cup-s4-id",
      name: "Educated Gamer 9,000 Diamonds Championship",
      slug: slug,
      game: "Free Fire",
      description: "The ultimate Battle Royale showcase for elite mobile Free Fire Guilds. 24 to 48 teams clash in custom limited ammo rooms across 5 legendary maps, streamed live on YouTube.",
      type: "SQUAD",
      status: "UPCOMING",
      maxSlots: 48,
      registeredCount: 0,
      entryFee: 400, // 400 PKR entry fee
      prizePool: "9,000 Diamonds Total (1st: 5000, 2nd: 2000, 3rd: 1000, 4th/5th: 500 each)",
      startDate: new Date("2026-08-10T18:00:00+05:30"),
      endDate: new Date("2026-08-12T22:00:00+05:30"),
      rules: "Limited Ammo: Yes, PC Not Allowed, 5 Maps Point System",
      discordLink: "https://discord.gg/educatedgamer3",
      whatsappLink: "https://chat.whatsapp.com/FNAfIjgLAo64IwNSRyy7OB",
      youtubeLink: "https://www.youtube.com/@EducatedGamer3",
    },
  });

  console.log("Successfully seeded tournament:");
  console.log(tournament);
}

main()
  .catch((e) => {
    console.error("Error seeding tournament:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
