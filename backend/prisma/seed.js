const prisma = require("../lib/prisma.js");

async function main() {
  console.log("🌱 Starting seed...");

  await prisma.character.deleteMany({});
  await prisma.level.deleteMany({});

  const levelsData = [
    {
      name: "beach",
      characters: [
        { name: "Waldo", minX: 0, maxX: 100, minY: 0, maxY: 100 }, // Top-Left
        { name: "Wizard", minX: 900, maxX: 1000, minY: 0, maxY: 100 }, // Top-Right
        { name: "Odlaw", minX: 0, maxX: 100, minY: 500, maxY: 800 }, // Bottom-Left
        { name: "Wenda", minX: 900, maxX: 1100, minY: 500, maxY: 1000 }, // Bottom-Right
      ],
    },
    {
      name: "snow",
      characters: [
        { name: "Waldo", minX: 0, maxX: 100, minY: 0, maxY: 100 },
        { name: "Wizard", minX: 900, maxX: 1000, minY: 0, maxY: 100 },
        { name: "Odlaw", minX: 0, maxX: 100, minY: 900, maxY: 1000 },
        { name: "Wenda", minX: 900, maxX: 1000, minY: 900, maxY: 1000 },
      ],
    },
    {
      name: "space",
      characters: [
        { name: "Waldo", minX: 0, maxX: 100, minY: 0, maxY: 100 },
        { name: "Wizard", minX: 900, maxX: 1000, minY: 0, maxY: 100 },
        { name: "Odlaw", minX: 0, maxX: 100, minY: 900, maxY: 1000 },
        { name: "Wenda", minX: 900, maxX: 1000, minY: 900, maxY: 1000 },
      ],
    },
    {
      name: "underwater",
      characters: [
        { name: "Waldo", minX: 0, maxX: 100, minY: 0, maxY: 100 },
        { name: "Wizard", minX: 900, maxX: 1000, minY: 0, maxY: 100 },
        { name: "Odlaw", minX: 0, maxX: 100, minY: 900, maxY: 1000 },
        { name: "Wenda", minX: 900, maxX: 1000, minY: 900, maxY: 1000 },
      ],
    },
    {
      name: "food",
      characters: [
        { name: "Waldo", minX: 0, maxX: 100, minY: 0, maxY: 100 },
        { name: "Wizard", minX: 900, maxX: 1000, minY: 0, maxY: 100 },
        { name: "Odlaw", minX: 0, maxX: 100, minY: 900, maxY: 1000 },
        { name: "Wenda", minX: 900, maxX: 1000, minY: 900, maxY: 1000 },
      ],
    },
    {
      name: "toystore",
      characters: [
        { name: "Waldo", minX: 0, maxX: 100, minY: 0, maxY: 100 },
        { name: "Wizard", minX: 900, maxX: 1000, minY: 0, maxY: 100 },
        { name: "Odlaw", minX: 0, maxX: 100, minY: 900, maxY: 1000 },
        { name: "Wenda", minX: 900, maxX: 1000, minY: 900, maxY: 1000 },
      ],
    },
  ];

  for (const level of levelsData) {
    const createdLevel = await prisma.level.create({
      data: {
        name: level.name,
        characters: {
          create: level.characters,
        },
      },
    });
    console.log(
      `✅ Created Level: ${createdLevel.name} with ${level.characters.length} characters.`,
    );
  }

  console.log("🚀 Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
