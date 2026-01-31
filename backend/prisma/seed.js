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
        { name: "Odlaw", minX: 109, maxX: 149, minY: 255, maxY: 295 },
        { name: "Wizard", minX: 305, maxX: 345, minY: 262, maxY: 302 },
        { name: "Wenda", minX: 914, maxX: 954, minY: 297, maxY: 337 },
        { name: "Waldo", minX: 727, maxX: 767, minY: 279, maxY: 319 },
        { name: "Woof", minX: 803, maxX: 843, minY: 269, maxY: 309 },
      ],
    },
    {
      name: "giants",
      characters: [
        { name: "Odlaw", minX: 689, maxX: 729, minY: 659, maxY: 699 },
        { name: "Waldo", minX: 196, maxX: 236, minY: 481, maxY: 521 },
        { name: "Wenda", minX: 814, maxX: 854, minY: 578, maxY: 618 },
        { name: "Wizard", minX: 1138, maxX: 1178, minY: 559, maxY: 599 },
        { name: "Woof", minX: 7, maxX: 47, minY: 535, maxY: 575 },
      ],
    },
    {
      name: "space",
      characters: [
        { name: "Wenda", minX: 336, maxX: 376, minY: 394, maxY: 434 },
        { name: "Wizard", minX: 923, maxX: 963, minY: 442, maxY: 482 },
        { name: "Odlaw", minX: 65, maxX: 105, minY: 529, maxY: 569 },
        { name: "Woof", minX: 690, maxX: 730, minY: 701, maxY: 741 },
        { name: "Waldo", minX: 469, maxX: 509, minY: 479, maxY: 519 },
      ],
    },
    {
      name: "underwater",
      characters: [
        { name: "Wizard", minX: 929, maxX: 969, minY: 73, maxY: 113 },
        { name: "Woof", minX: 1114, maxX: 1154, minY: 196, maxY: 236 },
        { name: "Wenda", minX: 607, maxX: 647, minY: 162, maxY: 202 },
        { name: "Waldo", minX: 781, maxX: 821, minY: 99, maxY: 139 },
        { name: "Odlaw", minX: 344, maxX: 384, minY: 124, maxY: 164 },
      ],
    },
    {
      name: "food",
      characters: [
        { name: "Waldo", minX: 669, maxX: 709, minY: 251, maxY: 291 },
        { name: "Woof", minX: 805, maxX: 845, minY: 447, maxY: 487 },
        { name: "Wenda", minX: 451, maxX: 491, minY: 227, maxY: 267 },
        { name: "Wizard", minX: 1010, maxX: 1050, minY: 633, maxY: 673 },
        { name: "Odlaw", minX: 467, maxX: 507, minY: 439, maxY: 479 },
      ],
    },
    {
      name: "toystore",
      characters: [
        { name: "Wenda", minX: 371, maxX: 411, minY: 606, maxY: 646 },
        { name: "Waldo", minX: 187, maxX: 227, minY: 516, maxY: 556 },
        { name: "Odlaw", minX: 1139, maxX: 1179, minY: 259, maxY: 299 },
        { name: "Woof", minX: 964, maxX: 1004, minY: 666, maxY: 706 },
        { name: "Wizard", minX: 941, maxX: 981, minY: 60, maxY: 100 },
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
