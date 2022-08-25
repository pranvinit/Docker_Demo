const keys = require("./keys");
const cors = require("cors");
const express = require("express");
const { createClient } = require("redis");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const redisClient = createClient(keys.redisUrl);
(async () => {
  redisClient.connect();
})();

redisClient.on("connect", () => {
  console.log("redis connected");
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

// Client that listen/publish information in redis needs to use duplicate()
const redisPublisher = redisClient.duplicate();

// Postgres Client setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("error", () => console.log("PG connection lost"));

pgClient
  .query("CREATE TABLE IF NOT EXISTS ideas (ideamap TEXT)")
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("<h3>Welcome to the node app</h3>");
});

app.get("/ideas/all", async (req, res) => {
  const ideas = await pgClient.query("SELECT * FROM ideas");
  res.status(200).json({ ideas, nbHits: ideas.length });
});

app.get("/moods/all", async (req, res) => {
  redisClient.hGetAll("moodmap", (err, values) => {
    res.status(200).json({ moods: values });
  });
});

app.post("/ideas", async (req, res) => {
  const { name, idea } = req.body;
  if (!name || !idea) {
    return res.status(400).json({ msg: "Please provide a name and idea" });
  }
  redisClient.hSet("moodmap", name, "Predicting...");
  redisPublisher.publish("insert", name);
  await pgClient.query("INSERT INTO ideas (ideamap) VALUES $1", [
    `${name}: ${idea}`,
  ]);

  res
    .status(201)
    .json({ msg: "Idea added successfully. Now predicting mood." });
});

app.listen(PORT, console.log(`Listening on port ${PORT}`));
