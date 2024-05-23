const redis = require('redis');

const client = redis.createClient({
    host: 'localhost',
    port: 6379
})


client.on("connect", () => console.error("redis client is connected"));


module.exports = client;