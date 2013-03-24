var mongoose = require('mongoose');
var redis = require('redis');

// Connect to mongodb
mongoose.connect('mongodb://127.0.0.1/HomeController8');
mongoose.connection.on('open', function () {
    console.log('Connected to Mongoose');
});

// Connect to redis
var redisClient = redis.createClient();
redisClient.select(1);
