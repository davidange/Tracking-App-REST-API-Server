const { point, circle } = require("@flatten-js/core");
/**
 * Calculates the location based on a list of measurements where
 * each item of the list is the distance measured to the beacon and its components
 * Note: as of Right now it Is implemented for a 2D trilateration (hence, component z is disregarded to simplify implementation)
 *
 * Reference:
 * Cantón Paterna, V.;
 * Calveras Augé, A.;
 * Paradells Aspas, J.;
 * Pérez Bullones, M.A.
 * A Bluetooth Low Energy Indoor Positioning System with Channel Diversity, Weighted Trilateration and Kalman Filtering.
 * Sensors 2017, 17, 2927.
 * https://doi.org/10.3390/s17122927
 */
const weightedMultilateration = (listOfMeasurements) => {
	if (listOfMeasurements.length < 3) {
		throw new Error("Number of measurements too low.");
	}
	//sort by closest and get only 3 closest elements
	sortedListOfMeasurements = listOfMeasurements
		.sort((a, b) => (a.radius > b.radius ? 1 : -1))
		.slice(0, 3);

	//create list of circles
	listOfCircles = sortedListOfMeasurements.map((measurement) =>
		circle(point(measurement.x, measurement.y), measurement.radius)
	);

	//calculate pair-wise weights
	//initialize 2D Matrix of weights
	weigths = new Array(listOfCircles.length);
	for (let i = 0; i < listOfCircles.length; i++) {
		weigths[i] = new Array(listOfCircles.length);
	}

	for (i = 0; i < listOfCircles.length; i++) {
		for (j = 0; j < listOfCircles.length; j++) {
			weigths[i][j] = Math.min(
				listOfCircles[i].r / listOfCircles[j].r,
				listOfCircles[j].r / listOfCircles[i].r
			);
		}
	}

	// calculates the intersection of the combination of circles
	let intersectionPoints = [];
	for (i = 0; i < listOfCircles.length; i++) {
		if (i < listOfCircles.length - 1) {
			intersectionPoints.push(listOfCircles[i].intersect(listOfCircles[i + 1]));
		} else {
			intersectionPoints.push(listOfCircles[i].intersect(listOfCircles[0]));
		}
	}


	//calculate the List distances from the intersection point of two circles to the center of the third one
	let distancesToIPsList = [];
	for (i = 0; i < listOfCircles.length; i++) {
		let index = i - 1;
		if (i === 0) {
			index = listOfCircles.length - 1;
		}
		distancesToIPsList.push(
			intersectionPoints[i].map((ip) => {
				return ip.distanceTo(listOfCircles[index].pc);
			})
		);
	}

	//Obtain the points in the intersection area
	const centerPoints = distancesToIPsList.map((distancesToIPs) => {
		return distancesToIPs.reduce((prev, curr) => {
			return prev[0] < curr[0] ? prev : curr;
		});
	});

	//obtain midpoint from centerPoints

	const midPoint = point(
        // midPoint X
		centerPoints.reduce((prev, curr) => (prev = prev + curr[1].ps.x), 0) /
            centerPoints.length,
        // midPoint Y
		centerPoints.reduce((prev, curr) => (prev = prev + curr[1].ps.y), 0) /
			centerPoints.length
	);

	console.log(midPoint);
};

module.exports = { weightedMultilateration };
