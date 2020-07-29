
const mongoose = require("mongoose");

const beaconSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	id_bimplus:{
		type: String,
		required: true,
		unique: true
	}
});



const Beacon= mongoose.model('BeaconSchema',beaconSchema);
module.exports=Beacon;
