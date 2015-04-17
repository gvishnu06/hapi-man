var User = require('./model').User;
var boom = require('boom');
var uuid = require('node-uuid');
var passwordHash = require('password-hash');
var logger = require('./logger');

exports.signup = {
    handler: function(request, reply) {
		///console.log(request.headers);
        if(request.payload.userId=='' || request.payload.password == '' || request.payload.userId==null || request.payload.password == null){
			return reply(boom.badRequest("Username/Password Empty"));
		}
		var userEntry;
		var hashedPassword = passwordHash.generate(request.payload.password);
		userEntry = new User(
		{
			userId : request.payload.userId,
			password : hashedPassword,
			fname : request.payload.fname,
			lname : request.payload.lname,
			email : request.payload.email,
			desc : request.payload.desc
		});
		
		userEntry.save(function(err){
			if(err){
				logger.error(err);
				if (11000 === err.code || 11001 === err.code) {
					
					reply(boom.forbidden("UserId already exists"));
				}
				else{
					reply(boom.forbidden(err));
				}
			}
			else{
				console.log("success!!!!!!!!!!!!!!!!!");
				reply();
			}
		});
    }
},
exports.login = {
    handler: function(request, reply) {
        if(request.payload.userId=='' || request.payload.password == '' || request.payload.userId==null || request.payload.password == null){
			return reply(boom.badRequest("Username/Password Empty"));
		}
		var hashedPassword = passwordHash.generate(request.payload.password);
		var id = uuid.v1();
		var time = Date.now();
		var query = '{ "userId" : "' + request.payload.userId +'", "password":"'+request.payload.password+'"}';
		//console.log(hashedPassword);
		/*User.update({userId : request.payload.userId, password : request.payload.password}, {$set : {token : id, time : time}},function(err,doc){
			if(err){
				return reply(boom.forbidden(err));
			}
			if(doc){
				if(doc.nModified == 1){
					reply({"token" : id, "time" : time});
				}
				else{
					return reply(boom.forbidden("Incorrect Username/Password Combinition"));
				}
			}
		});*/
		User.findOne({userId : request.payload.userId}, function(err,doc){
			if(err){
				logger.error(err);
				return reply(boom.forbidden(err));
			}
			if(doc){
				if(passwordHash.verify(request.payload.password, doc.password)){
					User.update({userId : request.payload.userId}, {$set : {token : id, time : time}},function(err,doc){
						if(err){
							logger.error(err);
							return reply(boom.forbidden(err));
						}
						if(doc){
							reply({"token" : id});
						}
					});
				}
				else{
					return reply(boom.forbidden("Incorrect Username/Password Combinition"));
				}
			}
			else{
				return reply(boom.forbidden("Incorrect Username/Password Combinition"));
			}
		});
			
		
		
    }
},
exports.logout = 
    function(request, reply) {
        if(request.payload.token=='' || request.payload.token==null){
			return reply(boom.badRequest("Token Empty"));
		}
		
		User.update({token : request.payload.token},{$set : {token : '', time:''}},function(err,doc){
			if(err){
				logger.error(err);
				return reply(boom.forbidden(err));
			}
			if(doc){
				reply();
				
			}
		});
		
    },
exports.getUser = 
    function(request, reply) {
		User.findOne({userId : request.params.id},{_id : 0, password : 0, token : 0, time : 0, __v : 0},function(err,doc){
			if(err){
				logger.error(err);
				return reply(boom.forbidden(err));
			}
			if(doc){
				reply(doc);
				
			}
			else{
				return reply(boom.forbidden("UserId not found"));
			}
		});
		
    },
exports.saveUser = 
    function(request, reply) {
		if(request.payload.fname == null || request.payload.lname == null || request.payload.email == null || request.payload.desc == null){
			return reply(boom.forbidden('Invalid Data'));
		}
		User.update({userId : request.payload.userId},{$set : {fname : request.payload.fname, lname : request.payload.lname , email : request.payload.email, desc : request.payload.desc }},function(err,doc){
			if(err){
				logger.error(err);
				return reply(boom.forbidden(err));
			}
			if(doc){
				if(doc.nModified == 1){
					reply();
				}
				else{
					return reply(boom.forbidden("UserId Not Present"));
				}
			}
		});
		
    },
exports.searchUser = 
    function(request, reply) {
		var queryString ={};
		if(request.payload.fname != null && request.payload.fname!=''){
			queryString.fname = request.payload.fname;
		}
		if(request.payload.lname != null && request.payload.lname!=''){
			queryString.lname = request.payload.lname;
		}
		if(request.payload.email != null && request.payload.email !=''){
			queryString.email  = request.payload.email ;
		}
		if(request.payload.userId != null && request.payload.userId!=''){
			queryString.userId = request.payload.userId;
		}
		User.find(queryString,{_id : 0, password : 0, token : 0, time : 0, __v : 0},function(err,doc){
			if(err){
				logger.error(err);
				return reply(boom.forbidden(err));
			}
			if(doc){
				reply(doc);
			}
			
		});
		
    };