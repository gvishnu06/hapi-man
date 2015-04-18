var Lab = require("lab");   
var Code = require('code'); 
var lab = exports.lab = Lab.script();
var server = require("../server");

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var username = makeid();

lab.experiment("Api Testing - ", function() {
	var token = "";
    lab.test("Signup Api Success", function(done) {
        var options = {
            method: "POST",
            url: "/users/signup",
			payload : {
						 userId : username,
						 password : "pass",
						 fname : "vishnu",
						 lname : "g",
						 email : "v@g.com",
						 desc : "myself"
					  }
        };
        
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            done();                                         
        });
    });
	
	lab.test("Login Api Success", function(done) {
        var options = {
            method: "POST",
            url: "/users/login",
			payload : {
						 userId : username,
						 password : "pass"
					  }
        };
        
        server.inject(options, function(response) {
			token = response.result.token;
			token.replace('.','');
			token.replace(' ','');
			Code.expect(response.result.token).to.have.length(36);
            Code.expect(response.statusCode).to.equal(200);
            done();                                         
        });
    });
	
	lab.test("Login  Failure", function(done) {
        var options = {
            method: "POST",
            url: "/users/login",
			payload : {
						 userId : username,
						 password : "pass1234"
					  }
        };
        
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(403);
            done();                                         
        });
    });
	
	lab.test("Logout Success", function(done) {
        var options = {
            method: "POST",
            url: "/users/logout",
			payload : {
						 token: token
					  }
        };
		
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(200);
            done();                                         
        });
    });
	
	lab.test("Logout Failure", function(done) {
        var options = {
            method: "POST",
            url: "/users/logout",
			payload : {
						 token: "1234"
					  }
        };
		
        server.inject(options, function(response) {
            Code.expect(response.statusCode).to.equal(403);
            done();                                         
        });
    });
});