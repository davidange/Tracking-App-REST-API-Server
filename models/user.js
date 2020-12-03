const mongoose = require("mongoose");

/**
 * Document Schema for a user.
 */

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		min: 6,
	},
	email: {
		type: String,
		required: true,
		max: 255,
		min: 6,
	},
	password: {
		type: String,
		required: true,
		max: 1024,
		min: 6,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});



const User= mongoose.model('User',userSchema);
module.exports=User;
