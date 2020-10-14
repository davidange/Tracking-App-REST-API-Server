const locationEstimatorServices = require("../services/location-estimator-services");
const trackedEntitiesServices = require("../services/tracked-entities-services");

const putTrackedUser = async (req, res) => {
	
	const userId = req.userId;
	const projectId = req.params.project_id;
	const measurementData = req.body.measurement_data;
	const locationMethod = req.body.location_method;
	try {
		const location = await locationEstimatorServices.estimateLocation(
			projectId,
			measurementData,
			locationMethod
		);

		await trackedEntitiesServices.putTrackedUser(userId, projectId, location);

		return res.status(200).send({
			message: "Successfully Stored User's Location",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getTrackedUser = async (req, res) => {
	const userId = req.params.user_id;
	const projectId = req.params.project_id;
	try {
		const trackedUser = await trackedEntitiesServices.getTrackedUser(
			userId,
			projectId
		);
		return res.status(200).send({
			tracked_user: trackedUser,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getTrackedUsers = async (req, res) => {
	const projectId = req.params.project_id;
	try {
		const trackedUser = await trackedEntitiesServices.getTrackedUsers(
			projectId
		);
		return res.status(200).send({
			tracked_users: trackedUser,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const putTrackedItem = async (req, res) => {
	const userId = req.userId;
	const projectId = req.params.project_id;
	const measurementData = req.body.measurement_data;
	const locationMethod = req.body.location_method;
	const itemId = req.body.item_id;
	const itemName = req.body.item_name;
	const itemDescription = req.body.item_description;
	const itemNote = req.body.item_note;


	try {
		const location = await locationEstimatorServices.estimateLocation(
			projectId,
			measurementData,
			locationMethod
		);

		await trackedEntitiesServices.putTrackedItem(
			userId,
			projectId,
			itemId,
			itemName,
			itemDescription,
			location,
			itemNote
		);

		return res.status(200).send({
			message: "Successfully Stored item's Location",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getTrackedItem = async (req, res) => {
	const itemId = req.params.item_id;
	const projectId = req.params.project_id;
	try {
		const trackedItem = await trackedEntitiesServices.getTrackedItem(
			itemId,
			projectId
		);
		return res.status(200).send({
			tracked_item: trackedItem,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getTrackedItems = async (req, res) => {
	const projectId = req.params.project_id;
	try {
		const trackedItems = await trackedEntitiesServices.getTrackedItems(
			projectId
		);
		return res.status(200).send({
			tracked_items: trackedItems,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

module.exports = {
	putTrackedUser,
	getTrackedUser,
	getTrackedUsers,
	putTrackedItem,
	getTrackedItem,
	getTrackedItems,
};
