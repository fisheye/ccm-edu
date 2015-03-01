var mongodb = require('./db');

function User(user){
	this.email = user.email;
	this.password = user.password;
}
module.exports =  User;

User.prototype.save = function save(callback){
	//save to Mongodb
	var user={
		email: this.email,
		password: this.password
	};
	mongodb.open(function(error,db){
		if(error){
			return callback(error);
		}
		
		//read all user collection
		db.collection('users',function(error,collection){
			if(error){
				mongodb.close();
				return callback(error);
			}
			//add index
			collection.ensureIndex('email',{unique:true});
			//write into document
			collection.insert(user,{safe:true},function(error,user){
				mongodb.close();
				callback(error,user);
			});
		});
	});
}

User.get = function get(email,callback){
	mongodb.open(function(error,db){
		if(error){
			return callback(error);
		}
		//read user collection
		db.collection('users',function(error,collection){
			if(error){
				mongodb.close();
				return callback(error);
			}
			//look for name='username'
			collection.findOne({email:email},function(error,doc){
				mongodb.close();
				if(doc){
					var user = new User(doc);
					callback(error,user);
				}else{
					callback(error,null);
				}
			});
		});
	});
}