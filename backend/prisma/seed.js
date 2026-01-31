const prisma = require("../lib/prisma.js");

async function main() {
  console.log("🌱 Starting seed...");

  try {
    await prisma.character.deleteMany({});
    await prisma.level.deleteMany({});
    console.log("🗑️  Cleared old data.");
  } catch (e) {
    console.log("⚠️  Database was already empty or could not be cleared.");
  }

  const levelsData = [
    {
      name: "beach",
      characters: [
        { name: "Odlaw", minX: 6.02, maxX: 14.14, minY: 28.0, maxY: 48.0 },
        { name: "Wizard", minX: 21.33, maxX: 29.45, minY: 29.0, maxY: 49.0 },
        { name: "Wenda", minX: 68.91, maxX: 77.03, minY: 34.0, maxY: 54.0 },
        { name: "Waldo", minX: 54.3, maxX: 62.42, minY: 31.0, maxY: 51.0 },
        { name: "Woof", minX: 60.23, maxX: 68.36, minY: 30.0, maxY: 50.0 },
      ],
    },
    {
      name: "giants",
      characters: [
        { name: "Odlaw", minX: 51.33, maxX: 59.45, minY: 85.0, maxY: 100.0 },
        { name: "Waldo", minX: 12.81, maxX: 20.94, minY: 60.0, maxY: 80.0 },
        { name: "Wenda", minX: 61.09, maxX: 69.22, minY: 73.0, maxY: 93.0 },
        { name: "Wizard", minX: 86.41, maxX: 94.53, minY: 70.0, maxY: 90.0 },
        { name: "Woof", minX: 0.0, maxX: 6.17, minY: 67.0, maxY: 87.0 },
      ],
    },
    {
      name: "space",
      characters: [
        { name: "Wenda", minX: 23.75, maxX: 31.88, minY: 48.0, maxY: 68.0 },
        { name: "Wizard", minX: 69.61, maxX: 78.73, minY: 54.0, maxY: 74.0 },
        { name: "Odlaw", minX: 2.58, maxX: 10.7, minY: 66.0, maxY: 86.0 },
        { name: "Woof", minX: 51.41, maxX: 59.53, minY: 90.0, maxY: 100.0 },
        { name: "Waldo", minX: 34.14, maxX: 42.27, minY: 58.0, maxY: 78.0 },
      ],
    },
    {
      name: "underwater",
      characters: [
        { name: "Wizard", minX: 70.08, maxX: 78.2, minY: 3.0, maxY: 23.0 },
        { name: "Woof", minX: 84.53, maxX: 92.66, minY: 20.0, maxY: 40.0 },
        { name: "Wenda", minX: 44.92, maxX: 53.05, minY: 16.0, maxY: 36.0 },
        { name: "Waldo", minX: 58.52, maxX: 66.64, minY: 7.0, maxY: 27.0 },
        { name: "Odlaw", minX: 24.38, maxX: 32.5, minY: 10.0, maxY: 30.0 },
      ],
    },
    {
      name: "food",
      characters: [
        { name: "Waldo", minX: 49.77, maxX: 57.89, minY: 28.0, maxY: 48.0 },
        { name: "Woof", minX: 60.39, maxX: 68.52, minY: 55.0, maxY: 75.0 },
        { name: "Wenda", minX: 32.73, maxX: 40.86, minY: 25.0, maxY: 45.0 },
        { name: "Wizard", minX: 76.41, maxX: 84.53, minY: 81.0, maxY: 100.0 },
        { name: "Odlaw", minX: 33.98, maxX: 42.11, minY: 54.0, maxY: 74.0 },
      ],
    },
    {
      name: "toystore",
      characters: [
        { name: "Wenda", minX: 26.48, maxX: 34.61, minY: 77.0, maxY: 97.0 },
        { name: "Waldo", minX: 12.11, maxX: 20.23, minY: 65.0, maxY: 85.0 },
        { name: "Odlaw", minX: 86.48, maxX: 97.61, minY: 29.0, maxY: 49.0 },
        { name: "Woof", minX: 72.81, maxX: 80.94, minY: 85.0, maxY: 100.0 },
        { name: "Wizard", minX: 71.02, maxX: 79.14, minY: 2.0, maxY: 22.0 },
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

  console.log("🚀 Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
