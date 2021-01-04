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
	if ("beacon-trilateration" == locationMethod || "beacon-trilateration-2"== locationMethod) {
		//extract measurement data from data
		const beaconsUids = data.map((beaconMeasurement) => beaconMeasurement.beacon_uid);
		let distances = data.map((beaconMeasurement) => beaconMeasurement.distance);

		//get Single distance measurement per beacon
		distances = distances.map((distanceMeasurement) => {
			//if distances[i] is an array of distance measurement of beacon, return the median
			if (Array.isArray(distanceMeasurement)) {
				const mid = Math.floor(distanceMeasurement.length / 2);
				//sort from smallest to biggest measurements
				distanceMeasurement.sort((a, b) => a - b);
				//return median value of measurements
				return distanceMeasurement.length % 2 !== 0
					? distanceMeasurement[mid]
					: (distanceMeasurement[mid - 1] + distanceMeasurement[mid]) / 2;
			}
			//if distances[i] is a single measurement
			return distanceMeasurement;
		});

		const locationBeacons = await beaconInfoServices.getBeaconsLocation(projectId, beaconsUids);

		const beaconsMeasurements = [];
		locationBeacons.forEach((locationBeacon, i) =>
			beaconsMeasurements.push({
				radius: distances[i],
				x: locationBeacon.x,
				y: locationBeacon.z,
			})
		);

		console.log('server is Calculating trilateration with ',JSON.stringify(beaconsMeasurements));

		let estimatedLocation;
		try {
			if("beacon-trilateration" == locationMethod){
				estimatedLocation = await trilaterationServices.weightedTrilateration(beaconsMeasurements);
			}else{
				estimatedLocation = await trilaterationServices.weightedTrilaterationCenterOfMass(beaconsMeasurements);
			}
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
