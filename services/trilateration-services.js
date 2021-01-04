const { point, segment, circle, Vector, matrix } = require("@flatten-js/core");
/**
 * Calculates the location based on a list of measurements where
 * each item of the list is the distance measured to the beacon and its components
 * Note: It is implemented as a 2D trilateration (hence, component z is disregarded to simplify implementation)
 *
 * @param {[JSON]} listOfMeasurements
 * Reference:
 * Cantón Paterna, V.;
 * Calveras Augé, A.;
 * Paradells Aspas, J.;
 * Pérez Bullones, M.A.
 * A Bluetooth Low Energy Indoor Positioning System with Channel Diversity, Weighted Trilateration and Kalman Filtering.
 * Sensors 2017, 17, 2927.
 * https://doi.org/10.3390/s17122927
 */
const weightedTrilateration = (listOfMeasurements) => {
	if (listOfMeasurements.length < 3) {
		throw new Error("Number of measurements too low.");
	}
	//sort by closest and get only 3 closest measuements
	sortedListOfMeasurements = listOfMeasurements.sort((a, b) => (a.radius > b.radius ? 1 : -1)).slice(0, 3);
	if (listOfMeasurements[0].radius <= 0) {
		throw new Error("Negative measurements are not possible");
	}
	//create list of circles that represents the measurements
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
			weigths[i][j] = Math.min(listOfCircles[i].r / listOfCircles[j].r, listOfCircles[j].r / listOfCircles[i].r);
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

	//Calculate number of intersections
	//if there is 6 intersections then all cirles intersect
	//if there is 2 intersections then only 2 circle intersect
	//if there is 0 intersections, then no cirlce intersect
	let numOfIntersections = 0;
	distancesToIPsList.forEach((distances) => {
		if (distances.length > 0) {
			numOfIntersections += 2;
		}
	});

	let locationPoint;

	if (numOfIntersections === 6) {
		//Obtain the centerPoints in the intersection area
		//(Area where it is more probable for the tracked item to be located at) and the distance to the center of the other Circle
		//{distance,segment}
		const centerPointsDistances = distancesToIPsList.map((distancesToIPs) => {
			return distancesToIPs.reduce((prev, curr) => {
				return prev[0] < curr[0] ? prev : curr;
			});
		});

		//obtain midpoint from the points obtained previously.

		const midPoint = point(
			// midPoint X
			centerPointsDistances.reduce((prev, curr) => (prev = prev + curr[1].ps.x), 0) / centerPointsDistances.length,

			// midPoint Y
			centerPointsDistances.reduce((prev, curr) => (prev = prev + curr[1].ps.y), 0) / centerPointsDistances.length
		);

		//line interconnecting midPoint to centerPoint from the intersection of the two smallest circles.
		//line will be scaled to represent the effect fo the weighting factor
		const line = segment(midPoint, centerPointsDistances[0][1].ps);

		//scaling matrices
		const translatingMatrix = matrix().translate(-midPoint.x, -midPoint.y); //translates to origin
		const scalingMatrix = matrix().scale(1 - weigths[0][2], 1 - weigths[0][2]); //scales line
		const translatingMatrix2 = matrix().translate(midPoint.x, midPoint.y); //translates back to original location

		const scaledLine = line.transform(translatingMatrix).transform(scalingMatrix).transform(translatingMatrix2);

		locationPoint = scaledLine.end;
	} else if (numOfIntersections === 4) {
		//circles intersect in Pairs (Example, Circle A intersects with B and C but C and B do not intersect.)
	} else if (numOfIntersections === 2) {
		//Two circles intersect
		// flattens list of Distances and finds the shortests Segment
		//(Returns only [1] as the [0] contains the length of the segment and [1] contains the Segment Object)
		const shortestLine = distancesToIPsList.flat().reduce(
			(prev, curr) => {
				return prev[0] < curr[0] ? prev : curr;
			},
			[Infinity]
		)[1];
		locationPoint = shortestLine.start;
	} else {
		//no circles Intersect

		//weights of circles radiuses
		//biggest and smallest circle
		const w31 = listOfCircles[0].r / listOfCircles[2].r;
		//middle and smallest cirlce
		const w32 = listOfCircles[0].r / listOfCircles[1].r;

		//line bewteen 2 smallest cirlces
		const line1 = segment(listOfCircles[0].pc, listOfCircles[1].pc);

		//intersection Point between line and circles
		const intersections = [];
		intersections.push(line1.intersect(listOfCircles[0])[0]);
		intersections.push(line1.intersect(listOfCircles[1])[0]);
		//Vector between intersection Points scaled to length d1
		const vectord1 = new Vector(intersections[0], intersections[1]).multiply(w32);

		const pointd1 = intersections[0].translate(vectord1);
		//line between point at d1 to center of biggest circle
		const line2 = segment(listOfCircles[2].pc, pointd1);

		const vectord2 = new Vector(pointd1, line2.intersect(listOfCircles[2])[0]).multiply(w31);

		locationPoint = pointd1.translate(vectord2);
	}

	locationPoint = locationPoint.toJSON();
	delete locationPoint.name;
	return locationPoint;
};

/**
 * Calculates the location based on a list of measurements where
 * each item of the list is the distance measured to the beacon and its components
 * Note: It is implemented as a 2D trilateration (hence, component z is disregarded to simplify implementation)
 *
 * Implementation proposed by us. Use weighted barycenter for calculating the location of the item. (Center Of Mass formulation)
 * @param {[JSON]} listOfMeasurements
 */
const weightedTrilaterationCenterOfMass = (listOfMeasurements) => {
	if (listOfMeasurements.length < 3) {
		throw new Error("Number of measurements too low.");
	}
	//sort by closest and get only 3 closest measuements
	sortedListOfMeasurements = listOfMeasurements.sort((a, b) => (a.radius > b.radius ? 1 : -1)).slice(0, 3);
	if (listOfMeasurements[0].radius <= 0) {
		throw new Error("Negative measurements are not possible");
	}
	//create list of circles that represents the measurements
	listOfCircles = sortedListOfMeasurements.map((measurement) =>
		circle(point(measurement.x, measurement.y), measurement.radius)
	);

	//calculate weights
	const totalRadius = sortedListOfMeasurements.reduce((previousValue, measurement) => {
		return previousValue + measurement.radius;
	}, 0);

	const weights = sortedListOfMeasurements.map((measurement) => {
		return totalRadius / measurement.radius;
	}, []);
	
	//calculate the point utilizing the center of mass formula
	const totalWeight=weights.reduce((total,weight)=>{return total+weight},0);
	let locationPoint = point(
		//x Coordinate
		sortedListOfMeasurements.reduce((totalX, measurement,index) => {
			return measurement.x*weights[index] + totalX;
		}, 0)/totalWeight,
		//y coordinate
		sortedListOfMeasurements.reduce((totalY, measurement,index) => {
			return measurement.y*weights[index] + totalY;
		}, 0)/totalWeight
	);


	//transform object to json and return only coordinates of data
	locationPoint = locationPoint.toJSON();
	delete locationPoint.name;
	return locationPoint;
};

module.exports = {
	weightedTrilateration,
	weightedTrilaterationCenterOfMass
};
