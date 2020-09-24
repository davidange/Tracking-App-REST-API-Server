const mongoose = require("mongoose");
const TrackedEntity = require("./tracked-entity");
const User = require("../user");

const TrackedUser = TrackedEntity.discriminator(
	"TrackedUser",
	new mongoose.Schema({
		user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }
		
	})
);


module.exports = TrackedUser;
