require("dotenv").config();
const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma.js");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/levels", async (req, res) => {
  try {
    const levels = await prisma.level.findMany();
    res.json(levels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/levels/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const level = await prisma.level.findUnique({
      where: {
        name: id,
      },
      include: {
        characters: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    res.json(level);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/validate", async (req, res) => {
  const { levelId, characterName, x, y } = req.body;

  console.log("X" + "->" + x, "Y" + "->" + y);

  const character = await prisma.character.findFirst({
    where: {
      level: { name: levelId },
      name: characterName,
    },
  });

  if (!character) return res.status(404).json({ error: "Character not found" });

  const isFound =
    x >= character.minX &&
    x <= character.maxX &&
    y >= character.minY &&
    y <= character.maxY;

  console.log(x, y, character.maxX, character.minY);

  if (isFound) {
    return res.json({ found: true, character: character.name });
  } else {
    return res.json({ found: false });
  }
});

app.post("/api/scores", async (req, res) => {
  const { username, time, levelName } = req.body;

  try {
    const level = await prisma.level.findUnique({
      where: { name: levelName },
    });

    if (!level) return res.status(404).json({ error: "Level not found" });

    const newScore = await prisma.score.create({
      data: {
        username,
        time,
        levelId: level.id,
      },
    });

    res.json(newScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

app.get("/api/scores/:levelName", async (req, res) => {
  const { levelName } = req.params;

  try {
    const scores = await prisma.score.findMany({
      where: {
        level: { name: levelName },
      },
      orderBy: {
        time: "asc",
      },
      take: 20,
    });

    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch scores" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
