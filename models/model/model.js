const mongoose = require("mongoose");

//const baseOptions={discriminatorKey:'modelType',collection:'models'};

const modelSchema = new mongoose.Schema({
    _id:String,
	name: {
		type: String,
		required: true,
    },
    description: {
        type:String
    },
    id_topology:{
        type: String,
        required: true,
    },
   
});

const Model= mongoose.model('ModelSchema',modelSchema);
module.exports=Model;
