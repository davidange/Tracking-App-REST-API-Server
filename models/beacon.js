const mongoose = require("mongoose");
const Location = require("./location");

/**
 * Document schema for a single beacon
 */ 
const beaconSchema = new mongoose.Schema({
	_id: String,// Bimplus
	uid_beacon: { //beacon 
		type: String,
	},
	name: { type: String, required: true },
	location: { type: Location.schema, required: true },
	is_active: { type: Boolean, default: false },
});

const Beacon = mongoose.model("BeaconSchema", beaconSchema);
module.exports = Beacon;
