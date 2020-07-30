const Model= require('./model');
const Beacon= require('../beacon');
const mongoose = require('mongoose');



const beaconModel=new mongoose.Schema({
    registered_beacons:[Beacon.schema], //registered Beacons
    unregistered_beacons:[Beacon.schema]//unregistered Beacons
})

const BeaconModel= Model.discriminator('BeaconModel',beaconModel)
module.exports=mongoose.model('BeaconModel',BeaconModel);