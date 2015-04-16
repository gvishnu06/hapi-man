var Hapi = require('hapi');
var routes = require('./routes');
var Db = require('./db');
var User = require('./model').User;
var boom = require('boom');
// Create a server with a host and port
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: process.env.PORT
});


server.register(require('hapi-auth-bearer-token'), function (err) {

    server.auth.strategy('tokenBased', 'bearer-access-token', {
        allowQueryToken: true,              // optional, true by default
        allowMultipleHeaders: false,        // optional, false by default
        accessTokenName: 'access_token',    // optional, 'access_token' by default
        validateFunc: function( token, callback ) {
			
			User.findOne({token : token},function(err,doc){
				if(err){
					return reply(boom.forbidden(err));
			}
			if(doc){
				console.log("!!!!" + (parseFloat(doc.time) + 28800 < Date.now()))
				if(parseFloat(doc.time) + 28800 < Date.now())
					callback(null, true, { token: token });
				else
					callback(null,false,{token : token});
			}
			else{
				callback(null,false,{token : token});
			}
			});
        }
    });
});

server.route(routes);
// Start the server
server.start(function(){
	console.log('Server started at: ' + server.info.uri);
});