const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = "redis://127.0.0.1:6379"

const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.cache = function (key) {
  this.useCache = true
  this.hashKey = key
  return this
}


mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return await exec.apply(this, arguments)
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );


  // See if we have a value for 'key' in redis
 
  const cacheValue = await client.hget(this.hashKey,key);
  
  // If we do, return that
  if (cacheValue) {
    const doc = JSON.parse(cacheValue);
    console.log("SERVING FROM CACHE")

    return Array.isArray(doc)
      ? doc.map(d => new this.model(d))
      : new this.model(doc);
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey,key, JSON.stringify(result));
  console.log("CACHING FROM DB")
  return result;
}
const clearHash=(hashKey)=>
   {
     client.del(hashKey)
   }
module.exports=clearHash