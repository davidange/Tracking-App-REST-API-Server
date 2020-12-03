const mongoose = require("mongoose");
const Model = require("./model/model");
const BeaconsModel = require("./model/beacons-model");

/**
 * Document Schema for a project
 */
const projectSchema = new mongoose.Schema({
	_id: String,
	slug: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	team_name: {
		type: String,
	},
	team_id: {
		type: String,
	},
	models: {
		type: [Model.schema],
	},
	beacons_model: {
		type: BeaconsModel.schema,
	},
});

const Project = mongoose.model("ProjectSchema", projectSchema);
module.exports = Project;
