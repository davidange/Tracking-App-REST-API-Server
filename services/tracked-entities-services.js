const TrackedItem = require("../models/trackedEntities/tracked-item");
const TrackedUser = require("../models/trackedEntities/tracked-user");
const User = require("../models/user");
const Project = require("../models/project");

/**
 * This Service is for Storing/getting the Location of a tracked Entity
 */

/**
 * Saves/updates the location of the tracked User
 * @param {String} userId
 * @param {String} projectId
 * @param {JSON} location
 * @returns the updated TrackedUser Item
 */
const putTrackedUser = async (userId, projectId, location) => {
	//Parallel run of calls to DB
	const responses = await Promise.all([
		User.findById(userId),
		Project.findById(projectId),
	]);
	const user = responses[0];
	const project = responses[1];

	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 404;
		throw error;
	}

	if (project === null) {
		const error = new Error("Project was not Found");
		error.statusCode = 404;
		throw error;
	}

	let trackedUser = await TrackedUser.findOne({
		user: user._id,
		project_ref: project._id,
	});

	//first Time
	if (trackedUser === null) {
		trackedUser = new TrackedUser({
			location: location,
			user: user,
			project_ref: project._id,
		});
	} else {
		//update Tracked User

		trackedUser.historicalData.unshift({
			location: trackedUser.location,
			date: trackedUser.date,
		});
		trackedUser.historicalData = trackedUser.historicalData.slice(0, 100); //number of total elements in historical data
		trackedUser.location = location;
		trackedUser.date = Date.now();
	}

	return await trackedUser.save();
};

/**
 * Gets the Tracked User
 * @param {String} userId
 * @param {String} projectId
 * @returns the Tracked User
 */
const getTrackedUser = async (userId, projectId) => {
	//Parallel run of calls to DB
	const responses = await Promise.all([
		User.findById(userId),
		Project.findById(projectId),
	]);
	const user = responses[0];
	const project = responses[1];

	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 404;
		throw error;
	}

	if (project === null) {
		const error = new Error("Project was not Found");
		error.statusCode = 404;
		throw error;
	}

	let trackedUser = await TrackedUser.findOne({
		user: user._id,
		project_ref: project._id,
	}).populate("user", ["email", "name"]);

	if (trackedUser === null) {
		const error = new Error(
			"There is no information about the tracking of the User"
		);
		error.statusCode = 404;
		throw error;
	}
	return trackedUser;
};

/**
 * get the list of all the tracked Users for current Project
 * @param projectId
 */
const getTrackedUsers = async (projectId) => {
	const project = await Project.findById(projectId);
	if (project === null) {
		const error = new Error("Project was not Found");
		error.statusCode = 404;
		throw error;
	}
	let trackedUsers = await TrackedUser.find({
		project_ref: project._id,
	}).select({user:1,location:1,_id:0},).populate("user", ["_id","email", "name"]);
	if (trackedUsers === null || trackedUsers.length === 0) {
		const error = new Error("There are no tracked Users.");
		error.statusCode = 404;
		throw error;
	}
	return trackedUsers;
};

/**
 * Saves/updates the location of a tracked Item
 * @param {String} userId
 * @param {String} projectId
 * @param {String} itemId
 * @param {String} itemName
 * @param {String} itemDescription
 * @param {JSON} location
 * @param {String} itemNote
 */
const putTrackedItem = async (
	userId,
	projectId,
	itemId,
	itemName,
	itemDescription,
	location,
	itemNote=null,
) => {
	//Parallel run of calls to DB
	const responses = await Promise.all([
		User.findById(userId),
		Project.findById(projectId),
	]);
	const user = responses[0];
	const project = responses[1];

	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 404;
		throw error;
	}

	if (project === null) {
		const error = new Error("Project was not Found");
		error.statusCode = 404;
		throw error;
	}

	let trackedItem = await TrackedItem.findOne({
		item_id: itemId,
		project_ref: project._id,
	});

	//first Time
	if (trackedItem === null) {
		trackedItem = new TrackedItem({
			location: location,
			posted_by: user,
			name: itemName,
			description: itemDescription,
			item_id: itemId,
			last_updated_by: user,
			project_ref: project._id,
		});
		//push Note if note is defined
		if (itemNote !== null && itemNote !== undefined) {
			trackedItem.notes.push(itemNote);
		}
	} else {
		//update Tracked Item
		trackedItem.historicalData.unshift({
			location: trackedItem.location,
			date: trackedItem.date,
		});
		trackedItem.historicalData = trackedItem.historicalData.slice(0, 100); //number of total elements in historical data
		trackedItem.location = location;
		trackedItem.date = Date.now();
		trackedItem.last_updated_by = user;
		trackedItem.description = itemDescription;
		trackedItem.name = itemName;
		//push Note if note is defined
		if (itemNote !== null && itemNote !== undefined) {
			trackedItem.notes.push(itemNote);
		}
	}

	return await trackedItem.save();
};

/**
 * Gets the Tracked Item
 * @param {String} itemId
 * @param {String} projectId
 * @returns the Tracked User
 */
const getTrackedItem = async (itemId, projectId) => {
	const project = await Project.findById(projectId);
	if (project === null) {
		const error = new Error("Project was not Found");
		error.statusCode = 404;
		throw error;
	}
	let trackedItem = await TrackedItem.findOne({
		item_id: itemId,
		project_ref: project._id,
	})	.populate("last_updated_by", ["email", "name"])
		.populate("posted_by", ["email", "name"]);

	if (trackedItem === null) {
		const error = new Error(
			"There is no tracking information about the desired Item"
		);
		error.statusCode = 404;
		throw error;
	}

	return trackedItem;
};

/**
 * get the list of all the tracked Users for selected Project
 */
const getTrackedItems = async (projectId) => {
	const project = await Project.findById(projectId);
	if (project === null) {
		const error = new Error("Project was not Found");
		error.statusCode = 404;
		throw error;
	}
	let trackedItems = await TrackedItem.find({ project_ref: project._id }).select({name:1,description:1,item_id:1,location:1,_id:0},)

	if (trackedItems === null || trackedItems.length === 0) {
		const error = new Error("There are no tracked Items.");
		error.statusCode = 404;
		throw error;
	}

	return trackedItems;
};

module.exports = {
	putTrackedUser,
	getTrackedUser,
	getTrackedUsers,
	putTrackedItem,
	getTrackedItem,
	getTrackedItems,
};
