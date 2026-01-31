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
        { name: "Odlaw", minX: 6.02, maxX: 14.14, minY: 31.92, maxY: 44.47 },

        { name: "Wizard", minX: 21.33, maxX: 29.45, minY: 32.89, maxY: 45.44 },

        { name: "Wenda", minX: 68.91, maxX: 77.03, minY: 37.75, maxY: 50.31 },

        { name: "Waldo", minX: 54.3, maxX: 62.42, minY: 35.25, maxY: 47.81 },

        { name: "Woof", minX: 60.23, maxX: 68.36, minY: 33.86, maxY: 46.42 },
      ],
    },
    {
      name: "giants",
      characters: [
        { name: "Odlaw", minX: 51.33, maxX: 59.45, minY: 88.03, maxY: 100.0 },

        { name: "Waldo", minX: 12.81, maxX: 20.94, minY: 63.31, maxY: 75.86 },

        { name: "Wenda", minX: 61.09, maxX: 69.22, minY: 76.78, maxY: 89.33 },

        { name: "Wizard", minX: 86.41, maxX: 94.53, minY: 74.14, maxY: 86.69 },
        { name: "Woof", minX: 0.0, maxX: 6.17, minY: 70.81, maxY: 83.36 },
      ],
    },
    {
      name: "space",
      characters: [
        { name: "Wenda", minX: 23.75, maxX: 31.88, minY: 51.22, maxY: 63.78 },

        { name: "Wizard", minX: 69.61, maxX: 77.73, minY: 57.89, maxY: 70.44 },

        { name: "Odlaw", minX: 2.58, maxX: 10.7, minY: 69.97, maxY: 82.53 },

        { name: "Woof", minX: 51.41, maxX: 59.53, minY: 93.86, maxY: 100.0 },

        { name: "Waldo", minX: 34.14, maxX: 42.27, minY: 63.03, maxY: 75.58 },
      ],
    },
    {
      name: "underwater",
      characters: [
        { name: "Wizard", minX: 70.08, maxX: 78.2, minY: 6.64, maxY: 19.19 },

        { name: "Woof", minX: 84.53, maxX: 92.66, minY: 23.72, maxY: 36.28 },

        { name: "Wenda", minX: 44.92, maxX: 53.05, minY: 19.0, maxY: 31.56 },

        { name: "Waldo", minX: 58.52, maxX: 66.64, minY: 10.25, maxY: 22.81 },

        { name: "Odlaw", minX: 24.38, maxX: 32.5, minY: 13.72, maxY: 26.28 },
      ],
    },
    {
      name: "food",
      characters: [
        { name: "Waldo", minX: 49.77, maxX: 57.89, minY: 31.36, maxY: 43.92 },

        { name: "Woof", minX: 60.39, maxX: 68.52, minY: 58.58, maxY: 71.14 },

        { name: "Wenda", minX: 32.73, maxX: 40.86, minY: 28.03, maxY: 40.58 },

        { name: "Wizard", minX: 76.41, maxX: 84.53, minY: 84.42, maxY: 96.97 },

        { name: "Odlaw", minX: 33.98, maxX: 42.11, minY: 57.47, maxY: 70.03 },
      ],
    },
    {
      name: "toystore",
      characters: [
        { name: "Wenda", minX: 26.48, maxX: 34.61, minY: 80.67, maxY: 93.22 },

        { name: "Waldo", minX: 12.11, maxX: 20.23, minY: 68.17, maxY: 80.72 },

        { name: "Odlaw", minX: 86.48, maxX: 94.61, minY: 32.47, maxY: 45.03 },

        { name: "Woof", minX: 72.81, maxX: 80.94, minY: 89.0, maxY: 100.0 },

        { name: "Wizard", minX: 71.02, maxX: 79.14, minY: 4.83, maxY: 17.39 },
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
