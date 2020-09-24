const TrackedEntity = require("../models/trackedEntities/tracked-entity");
const TrackedItem = require("../models/trackedEntities/tracked-item");
const TrackedUser = require("../models/trackedEntities/tracked-user");
const User = require("../models/user");

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

const getTrackedUser = async (userId) => {
	const user = await User.findById(userId);
	if (user === null) {
		const error = new Error("User was not Found");
		error.statusCode = 404;
		throw error;
	}
	let trackedUser = await TrackedUser.findOne({ user: user._id });

	if (trackedUser === null) {
		const error = new Error(
			"There is no information about the tracking of the User"
		);
		error.statusCode = 403;
		throw error;
	}
	return trackedUser;
};

module.exports = { putTrackedUser, getTrackedUser};
