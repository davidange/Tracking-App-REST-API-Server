const mongoose = require("mongoose");



const bimPlusTeamSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
});



const BimPlusTeam= mongoose.model('BimPlusTeamSchema',bimPlusTeamSchema);
module.exports=BimPlusTeam;
