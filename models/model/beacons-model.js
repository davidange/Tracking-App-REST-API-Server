const Beacon = require("../beacon");
const mongoose = require("mongoose");

const beaconsModel = new mongoose.Schema({
	_id: {type: String},
	registered_beacons: [Beacon.schema], //registered Beacons
	unregistered_beacons: [Beacon.schema], //unregistered Beacons
});

module.exports = mongoose.model("BeaconsModel", beaconsModel);
