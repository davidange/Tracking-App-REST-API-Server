const mongoose = require("mongoose");



const projectSchema = new mongoose.Schema({
	slug:{
		type: String,
		required: true
	},
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



const Project= mongoose.model('ProjectSchema',projectSchema);
module.exports=Project;
