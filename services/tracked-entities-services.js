const TrackedEntity = require("../models/trackedEntities/tracked-entity");
const TrackedItem = require("../models/trackedEntities/tracked-item");
const TrackedUser = require("../models/trackedEntities/tracked-user");
const User = require("../models/user");


/**
 * This Service is for Storing/getting the Location of a tracked Entity
 */



/**
 * Saves/updates the location of the tracked User
 * @param {String} userId
 * @param {JSON} location
 * @returns the updated TrackedUser Item
 */
const putTrackedUser = async (userId, location) => {
	const user = await User.findById(userId);
	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 403;
		throw error;
	}
	let trackedUser = await TrackedUser.findOne({ user: user._id });

	//first Time
	if (trackedUser === null) {
		trackedUser = new TrackedUser({ location: location, user: user });
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
 * @returns the Tracked User
 */
const getTrackedUser = async (userId) => {
	const user = await User.findById(userId);
	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 404;
		throw error;
	}
	let trackedUser = await TrackedUser.findOne({ user: user._id }).populate('user',['email','name']);

	if (trackedUser === null) {
		const error = new Error(
			"There is no information about the tracking of the User"
		);
		error.statusCode = 403;
		throw error;
	}
	return trackedUser;
};

/**
 * get the list of all the tracked Users
 */
const getTrackedUsers = async () => {
	let trackedUsers = await TrackedUser.find({}).populate('user',['email','name']);
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
 * @param {String} itemId
 * @param {String} itemName
 * @param {String} itemDescription
 * @param {JSON} location
 */
const putTrackedItem = async (
	userId,
	itemId,
	itemName,
	itemDescription,
	location
) => {
	const user = await User.findById(userId);
	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 403;
		throw error;
	}
	let trackedItem = await TrackedItem.findOne({ item_id: itemId });
	//first Time
	if (trackedItem === null) {
		trackedItem = new TrackedItem({
			location: location,
			posted_by: user,
			name: itemName,
			description: itemDescription,
			item_id: itemId,
			last_updated_by: user,
		});
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
	}

	return await trackedItem.save();
};

/**
 * Gets the Tracked Item
 * @param {String} itemId
 * @returns the Tracked User
 */
const getTrackedItem = async (itemId) => {
	let trackedItem = await TrackedItem.findOne({ item_id: itemId }).populate('last_updated_by',['email','name']).populate('posted_by',['email','name']);

	if (trackedItem === null) {
		const error = new Error(
			"There is no tracking information about the desired Item"
		);
		error.statusCode = 403;
		throw error;
	}

	return trackedItem;
};

/**
 * get the list of all the tracked Users
 */
const getTrackedItems = async () => {
	let trackedItems = await TrackedItem.find({}).populate('last_updated_by',['email','name']).populate('posted_by',['email','name']);
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
