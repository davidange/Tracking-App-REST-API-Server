const mongoose = require("mongoose");
const Location = require("./location");

const beaconSchema = new mongoose.Schema({
	_id: String,
	id_beacon: {
		//TODO modify name of id_beacon property
		type: String,
		unique: true,
	},
	name: { type: String, required: true },
	location: { type: Location.schema, required: true },
	is_active: { type: Boolean, default: false },
});

const Beacon = mongoose.model("BeaconSchema", beaconSchema);
module.exports = Beacon;
