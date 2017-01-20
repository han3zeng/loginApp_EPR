var redis = require("redis");
var client = redis.createClient();
var bcrypt = require('bcryptjs');



class UserHandler {
  createUser(newUser,callback) {
    bcrypt.genSalt(10, function(err, salt) {
  	    bcrypt.hash(newUser.password, salt, function(err, hash) {
  	        newUser.password = hash;
  	        // save user in redis
            client.hmset(newUser.email, "name", newUser.name, "email", newUser.email, "username", newUser.username, "password", newUser.password , redis.print);
  	    });
  	});
  }
  // callback node-redis return the search result
  getUserByEmail(email, callback) {
    client.hgetall(email, callback);
  }

  comparePassword(origianlPW, hashedPW, callback) {
    bcrypt.compare(origianlPW, hashedPW, function(err, isMatch) {
      	if(err) throw err;
      	callback(null, isMatch);
  	});
  }

  getUserById(email, callback) {
    client.hgetall(email, callback);
  }
}


module.exports = new UserHandler()
