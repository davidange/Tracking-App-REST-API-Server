const mongoose = require("mongoose");
const Model=require('./model/model');



const projectSchema = new mongoose.Schema({
	_id:String,
	slug:{
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
	},
	models:{
		type:[Model.schema]
	}
});



const Project= mongoose.model('ProjectSchema',projectSchema);
module.exports=Project;
