// redis/ioredisClient.js
const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1',  // default
  port: 6379,         // default
  // password: 'your_password', // Uncomment if needed
});

redis.on('connect', () => {
  console.log('Connected to Redis using ioredis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;
