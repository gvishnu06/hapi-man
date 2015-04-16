var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;
var UserSchema = new Schema({
    userId: { type: String, unique: true, required: true },
    password: { type: String, required: true , encrypted: true},
	fname : {type : String},
	lname : {type : String},
	email : {type : String},
	desc  : {type : String},
	token : {type : String},
	time  : {type : String}
})
var user = Mongoose.model('user', UserSchema);
module.exports = {
    User: user
};