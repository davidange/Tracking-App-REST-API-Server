
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
	_id: false,
    x:{type:Number,required: true},
    y:{type:Number,required: true},
    z:{type:Number,required: true}
});



const Location= mongoose.model('LocationSchema',locationSchema);
module.exports=Location;
