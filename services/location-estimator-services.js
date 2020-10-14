const trilaterationServices = require("./trilateration-services");
const beaconInfoServices = require("./beacons-info-services");
/**
 * Service to Estimate The Location of the Entity
 * selects the method depending on the location Method
 * TODO Implement checks to see if weighted trilateration should be ran or use GPS data to calculate it
 *
 */

/**
 * Estimates the Data based on the Location method Selected
 * @param {JSON} data for beacon-trilateration: [{distance,beacon_uid}] || for gps-location
 * @param {String} locationMethod
 */
const estimateLocation = async (projectId, data, locationMethod) => {
	if ("beacon-trilateration" == locationMethod) {
		const beaconsUids = data.map(
			(beaconMeasurement) => beaconMeasurement.beacon_uid
		);
		const distances = data.map(
			(beaconMeasurement) => beaconMeasurement.distance
		);

		const locationBeacons = await beaconInfoServices.getBeaconsLocation(
			projectId,
			beaconsUids
		);

		const beaconsMeasurements = [];
		locationBeacons.forEach((locationBeacon, i) =>
			beaconsMeasurements.push({
				radius: distances[i],
				x: locationBeacon.x,
				y: locationBeacon.z,
			})
		);

		//TODO ADD TRY CATCH HERE!!!!!!!!
		//if it fails, add status code and maybe ask user to use GPS Location now....
		let estimatedLocation;
		try {
			estimatedLocation = await trilaterationServices.weightedTrilateration(
				beaconsMeasurements
			);
		} catch (err) {
			const error = new Error("Trilateration Failed");
			error.statusCode = 420;
			throw error;
		}
		//NOTE: BIMPLUS COORDINATE SYSTEM HAS THE Y AXIS POINTING UP!!!!!!!!!
		estimatedLocation.z = estimatedLocation.y;
		estimatedLocation.y = locationBeacons[0].y;
		return estimatedLocation;
	} else if ("gps-location" == locationMethod) {
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
