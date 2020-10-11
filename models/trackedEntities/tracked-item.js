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
		posted_date: { type: Date, required: true, default: Date.now },
		last_updated_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: { type: String },
		description: { type: String },
		notes: { type: [String] },
		item_id: { type: String, required: true },
	})
);

module.exports = TrackedItem;
