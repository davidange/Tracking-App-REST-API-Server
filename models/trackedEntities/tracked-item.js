const mongoose = require("mongoose");
const TrackedEntity = require("./tracked-entity");
const User = require("../user");

const TrackedItem = TrackedEntity.discriminator(
	"TrackedItem",
	new mongoose.Schema({
		posted_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: { type: String },
		description: { type: String },
		item_id: { type: String, required: true },
	})
);

module.exports = TrackedItem;
