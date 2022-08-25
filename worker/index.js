const keys = require("./keys");
const { createClient } = require("redis");
const MOODS = require("./moods");

const redisClient = createClient(keys.redisUrl);
(async () => {
  redisClient.connect();
})();

redisClient.on("connect", () => {
  console.log("redis connected");
});

redisClient.on("error", function (err) {
  console.log(err);
});

// Required config for watching changes in a redis instance
const subscriber = redisClient.duplicate();

// add worker file logic

const getMood = () => {
  const moodIndex = Math.floor(Math.random() * MOODS.length);
  return MOODS[moodIndex];
};

subscriber.on("messsage", (channel, name) => {
  redisClient.hSet("moodmap", name, getMood());
});

// Watch for inserts in the redis instace
subscriber.subscribe("insert");
