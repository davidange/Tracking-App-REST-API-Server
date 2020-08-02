const Beacon = require("../beacon");
const mongoose = require("mongoose");

const beaconsModel = new mongoose.Schema({
	_id: String,
	beacons: [Beacon.schema], //All Beacons
});

module.exports = mongoose.model("BeaconsModel", beaconsModel);
