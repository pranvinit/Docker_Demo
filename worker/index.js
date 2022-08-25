const keys = require("./keys");
const MOODS = require("./moods");

const Redis = require("ioredis");

const redisClient = new Redis({ port: keys.redisPort, host: keys.redisHost });

// Required config for watching changes in a redis instance
const subscriber = new Redis({ port: keys.redisPort, host: keys.redisHost });

// add worker file logic

const getMood = () => {
  const moodIndex = Math.floor(Math.random() * MOODS.length);
  return MOODS[moodIndex];
};

// Watch for inserts in the redis instace
subscriber.subscribe("insert", (err, count) => {
  console.log(`Working for predicting moods`);
});

subscriber.on("message", (channel, name) => {
  redisClient.hset("moodmap", name, getMood());
});
