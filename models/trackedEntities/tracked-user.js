const mongoose = require("mongoose");
const TrackedEntity = require("./tracked-entity");

/**
 * Document Schema representing the location of a User
 */
const TrackedUser = TrackedEntity.discriminator(
	"TrackedUser",
	new mongoose.Schema({
		user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true }
		
	})
);


module.exports = TrackedUser;
