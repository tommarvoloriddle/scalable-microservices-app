
const { createClient } = require('redis');
const dotenv = require('dotenv').config()
const REDIS_PORT = process.env.REDIS_PORT
const REDIS_HOST = process.env.REDIS_HOST
const REDIS_PASSWORD = process.env.REDIS_PASSWORD
// write custom ratelimiter middleware


let client = null;

const getRedisClient = async () => {
    if (client) {
        return client;
    } else {
        client = createClient({
            password: REDIS_PASSWORD,
            socket: {
                host: REDIS_HOST,
                port: REDIS_PORT
            }
        });
        try {
            await client.connect();
        } catch (error) {
            console.error('REDIS CONNECTION ERROR:', dotenv);
        }
        return client;  
    }  
};

const rateLimiter = async (req, res, next) => {
    const clientIP = req.ip;
    redisClient = await getRedisClient(); 
    try {
        let no_of_requests = await redisClient.get(clientIP);
        if (no_of_requests > 50) {
            console.log('Too many requests', await redisClient.ttl(clientIP));
            return res.status(429).send('Too many requests');
        }
        else {
            redisClient.expire(clientIP, 60);
            redisClient.incr(clientIP);
        }
    } catch (error) {
        // console.error('Error:', error); 
        console.log('Error:', error);
    }
    next();
};

exports.rateLimiter = rateLimiter;


