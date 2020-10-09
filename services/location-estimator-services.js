const trilaterationServices = require("./trilateration-services");
/**
 * Service to Estimate The Location of the Entity
 * selects the method depending on the location Method
 * TODO Implement checks to see if weighted trilateration should be ran or use GPS data to calculate it
 * 
 */

/**
 * Estimates the Data based on the Location method Selected
 * @param {JSON} data 
 * @param {String} locationMethod 
 */
const estimateLocation = (data, locationMethod) => {
	if ("beacon-trilateration".localeCompare(locationMethod)) {
		return trilaterationServices.weightedTrilateration(data);
	} else if ("gps-location".localeCompare(locationMethod)) {
		const error = new Error("Method is still not implemented");
		error.statusCode = 500;
		throw error;
	} else {
		const error = new Error("location Method is invalid");
		error.statusCode = 404;
		throw error;
	}
};

module.exports = {
	estimateLocation,
};
