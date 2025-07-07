const  { createClient } = require('redis');

const Redisclient = createClient({
    username: 'default',
    password: process.env.redis_p,
    socket: {
        host: 'redis-14888.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 14888
    }
});

module.exports= Redisclient;

