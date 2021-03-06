const bimPlusServices = require("./bim-plus-services");
const Project = require("../models/project");

/** 
 * Get all the beacons from a project
 * @params {String} projectId 
 * @returns {JSON} list of beacons
*/
const getBeacons = async (projectId) => {
	const beacons = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
		_id: 0,
	});
	if (beacons === null) {
		const error = new Error("Project Not found");
		error.statusCode = 404;
		throw error;
	}
	if (Object.keys(beacons.toJSON()).length === 0) {
		const error = new Error("Project has not defined a beacons model");
		error.statusCode = 500;
		throw error;
	}
	if (Object.keys(beacons.toJSON().beacons_model.beacons).length === 0) {
		const error = new Error("There are no beacons");
		error.statusCode = 500;
		throw error;
	}
	return beacons.beacons_model.beacons;
};

/** 
 * Get all the active beacons from a project. An active Beacon is a beacon that has its UID set.
 * @params {String} projectId 
 * @returns {JSON} list of active beacons
*/
const getActiveBeacons = async (projectId) => {
	//change logic so thai it only runs getBeaconsFunction(...)(for pagination)
	const beacons = await getBeacons(projectId);
	const activeBeacons = beacons.filter((beacon) => beacon.is_active === true);
	return activeBeacons;
};

/** 
 * Get information about specific Beacon
 * @params {String} projectId 
 * @params {String} beaconId 
 * @returns {JSON} list of active beacons
*/
const getBeacon = async (projectId, beaconId) => {
	const project = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
	});
	if (project === null) {
		const error = new Error("Project Was not Found");
		error.statusCode = 404;
		throw error;
	}
	const beacon = project.beacons_model.beacons.id(beaconId);
	if (beacon === null) {
		const error = new Error("Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}
	return beacon;
};

/**
 * Gets location of desired beacons
 * @params {String} projectId 
 * @params {[String]} beaconsUID 
 */
const getBeaconsLocation = async (projectId, beaconsUid) => {
	const project = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
	});
	if (project === null) {
		const error = new Error("Project Was not Found");
		error.statusCode = 404;
		throw error;
	}

	const locations = [];
	const beacons = project.beacons_model.beacons;

	for (let beaconUid of beaconsUid) {
		let beacon = beacons.find((beacon) => beacon.uid_beacon === beaconUid);
		if (beacon === undefined || beacon === null) {
			const error = new Error("A Beacon UID  Is not found Found");
			error.statusCode = 404;
			throw error;
		}
		locations.push(beacon.location);
	}

	return locations;
};

/**
 * Sets the UID of a beacon
 * @params {String} projectId 
 * @params {String} beaconId 
 * @params {String} beaconUID 
 */
const setBeaconUID = async (projectId, beaconId, beaconUID) => {
	const project = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
	});

	if (project === null) {
		const error = new Error("Project/Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}
	const beacon = project.beacons_model.beacons.id(beaconId);
	if (beacon === null) {
		const error = new Error("Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}
	//check if there is another beacon with the same UID
	let beaconWithUID;
	if (beaconUID && beaconUID !== "") {
		beaconWithUID = project.beacons_model.beacons.find((beacon) => beacon.uid_beacon === beaconUID);
	}
	//if there is a beacon with that UID
	if (beaconWithUID) {
		// the beacon that the user wants to change to already has the updated Data
		if (beaconWithUID._id === beacon._id) {
			return beacon;
		}
		const error = new Error("There is another beacon that already has that UID");
		error.statusCode = 403;
		throw error;
	}

	beacon.uid_beacon = beaconUID;
	if (beaconUID && beaconUID !== "") {
		beacon.is_active = true;
	} else {
		beacon.is_active = false;
	}

	await beacon.save({ suppressWarning: true }); //validate Subdocument Beacon
	await project.save(); //save Project Document
	return beacon;
};

/**
 * Removes the UID of a beacon
 * @params {String} projectId 
 * @params {String} beaconId 
 */
const deleteBeaconUID = async (projectId, beaconId) => {
	const project = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
	});

	if (project === null) {
		const error = new Error("Project/Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}
	const beacon = project.beacons_model.beacons.id(beaconId);
	if (beacon === null) {
		const error = new Error("Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}

	beacon.uid_beacon = undefined;
	beacon.is_active = false;
	await beacon.save({ suppressWarning: true }); //validate Subdocument Beacon
	await project.save(); //save Project Document
	return beacon;
};

module.exports = {
	getBeacons,
	getActiveBeacons,
	getBeacon,
	getBeaconsLocation,
	setBeaconUID,
	deleteBeaconUID,
};
