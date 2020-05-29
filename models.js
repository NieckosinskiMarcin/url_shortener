const shortId = require('shortid');
const redisModule = require('redis');
const client = redisModule.createClient('6379', 'redis-server');

client.on('connect', () => {
    console.log('Redis connected');
});

client.on('ready', () => {
    console.log('Redis ready');
});

client.on('error', (error) => {
    console.log('Error while connecting to Redis' + error);
    process.exit(0);
});

function storeURL(url) {
    return new Promise((resolve, reject) => {
	client.get(url, (err, reply) => {
	    if(err) {
		return reject('error occurred during storage operation');
	    }
	    if(reply) {
		resolve(reply);
	    } else {
		let id = shortId.generate();
		client.set(id, url, 'EX', 86400);
		client.set(url, id, 'EX', 86400);
		resolve(id);
	   }
       });
   });
}

function findURL(key) {
    return new Promise((resolve, reject) => {
	client.get(key, (err, reply) => {
	    if(err) {
		return reject('error occurred during finding operation');
	    }
	    if(reply === null) {
		resolve(null);
	    } else {
		resolve(reply);
	    }
        });
    });
}

module.exports = {
    storeURL: storeURL,
    findURL: findURL
};
