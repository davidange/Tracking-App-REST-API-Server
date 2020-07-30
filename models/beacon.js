
const mongoose = require("mongoose");

const beaconSchema = new mongoose.Schema({
	_id: String,
	id_beacon:{ //TODO modify name of id_beacon property
		type: String,
		unique: true
	}
});



const Beacon= mongoose.model('BeaconSchema',beaconSchema);
module.exports=Beacon;
