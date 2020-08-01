const Beacon = require("../beacon");
const mongoose = require("mongoose");

const beaconsModel = new mongoose.Schema({
	idBimplus:{type: String},
	beacons: [Beacon.schema], //All Beacons
});

module.exports = mongoose.model("BeaconsModel", beaconsModel);
