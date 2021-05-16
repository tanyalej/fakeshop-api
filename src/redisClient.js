const redis = require('redis')
const rejson = require('redis-rejson')

rejson(redis)

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});
    
redisClient.on('error', err => console.log('Redis error: ', err)) 
redisClient.on('connect', () => console.log('Successfully connected to Redis cloud'))  

module.exports = redisClient
