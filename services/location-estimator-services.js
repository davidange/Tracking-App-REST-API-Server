const trilaterationServices = require("./trilateration-services");
const beaconInfoServices=require('./beacons-info-services')
/**
 * Service to Estimate The Location of the Entity
 * selects the method depending on the location Method
 * TODO Implement checks to see if weighted trilateration should be ran or use GPS data to calculate it
 * 
 */

/**
 * Estimates the Data based on the Location method Selected
 * @param {JSON} data for beacon-trilateration: [{distance,beaconUid}] || for gps-location
 * @param {String} locationMethod 
 */
const estimateLocation =async (projectId,data, locationMethod) => {

	if ("beacon-trilateration"==locationMethod) {
		
		const beaconsUids=data.map(beaconMeasurement=>beaconMeasurement.beaconUid)
		const distances=data.map(beaconMeasurement=>beaconMeasurement.distance)

		const locationBeacons=await beaconInfoServices.getBeaconsLocation(projectId,beaconsUids);

		const beaconsMeasurements=[];
		locationBeacons.forEach((locationBeacon,i)=>beaconsMeasurements.push({radius:distances[i],x:locationBeacon.x,y:locationBeacon.y}));
		
		return trilaterationServices.weightedTrilateration(beaconsMeasurements);
	} else if ("gps-location"==locationMethod) {
		const error = new Error("Method is still not implemented");
		error.statusCode = 500;
		throw error;
	} else {
		const error = new Error("location Method is invalid");
		error.statusCode = 400;
		throw error;
	}
};


module.exports = {
	estimateLocation,
};
