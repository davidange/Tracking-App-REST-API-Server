
const mongoose = require("mongoose");

/**
 * Document Schema for location.
 */
const locationSchema = new mongoose.Schema({
	_id: false,
    x:{type:Number,required: true},
    y:{type:Number,required: true},
    z:{type:Number,required: true}
});



const Location= mongoose.model('LocationSchema',locationSchema);
module.exports=Location;
