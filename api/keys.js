module.exports = {
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.POSTGRES_DB,
  pgPassword: process.env.POSTGRES_PASSWORD,
  pgPort: process.env.PGPORT,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
};
