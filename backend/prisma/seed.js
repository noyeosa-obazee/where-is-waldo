const prisma = require("../lib/prisma.js");

async function main() {
  await prisma.level.create({
    data: {
      name: "beach",
      characters: {
        create: [
          { name: "Waldo", minX: 420, maxX: 460, minY: 850, maxY: 900 },
          { name: "Wizard", minX: 100, maxX: 150, minY: 200, maxY: 250 },
        ],
      },
    },
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
