const mongoose = require("mongoose");
const Location = require("../location");

const baseOptions = { discriminatorKey: "entityType" };

const trackedEntitySchema = new mongoose.Schema(
	{
		location: { type: Location.schema, required: true },
		date: { type: Date, required: true, default: Date.now },
		project_ref: {
			type: String,
			ref: "ProjectSchema",
			required: true,
		},
		historicalData: {
			type: [
				{
					_id: false,
					location: { type: Location.schema },
					date: { type: Date },
				},
			],
		},
	},
	baseOptions
);

const TrackedEntity = mongoose.model("TrackedEntity", trackedEntitySchema);
module.exports = TrackedEntity;
