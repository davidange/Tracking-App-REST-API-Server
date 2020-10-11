const { check, validationResult, oneOf } = require("express-validator");

const putTrackedEntityValidation = [
	check("project_id")
		.trim()
		.notEmpty()
		.withMessage("Project Id cannot be empty")
		.bail(),
	oneOf([
		[
			check("location_method")
				.trim()
				.not()
				.isEmpty()
				.withMessage("The Method to calculate the location cannot be Empty")
				.equals("beacon-trilateration")
				.withMessage("The Method is not Implemented")
				.bail(),
			check("measurement_data.*.distance")
				.exists()
				.withMessage("Measurement Data is not valid")
				.isNumeric()
				.withMessage("Measurement Data is not valid"),
			check("measurement_data.*.beaconUid")
				.exists()
				.withMessage("Measurement Data is not valid")
				.isString()
				.withMessage("Measurement Data is not valid"),
		],
		[
			check("location_method")
				.trim()
				.not()
				.isEmpty()
				.withMessage("The Method to calculate the location cannot be Empty")
				.equals("gps_location")
				.withMessage("The Method is not Implemented")
				.bail(),
			//TODO ADD VALIDATION OF MEASUREMENT DATASTRUCTURE FOR GPS LOCAITON METHOd
		],
	]).bail(),
];

const putTrackedUserValidation = putTrackedEntityValidation;

const getTrackedUserValidation = [
	check("project_id")
		.trim()
		.notEmpty()
		.withMessage("Project Id cannot be empty")
		.bail(),
	check("user_id")
		.trim()
		.notEmpty()
		.withMessage("Project Id cannot be empty")
		.bail(),
];

const getTrackedUsersValidation = [
	check("project_id")
		.trim()
		.notEmpty()
		.withMessage("Project Id cannot be empty")
		.bail(),
];

const putTrackedItemValidation = [
	...putTrackedEntityValidation,
	check("item_id")
		.trim()
		.notEmpty()
		.withMessage("Item Id cannot be empty")
		.bail(),
	check("item_name")
		.trim()
		.notEmpty()
		.isString()
		.withMessage("Item Name cannot be empty")
		.bail(),
	check("item_description")
		.trim()
		.notEmpty()
		.isString()
		.withMessage("Item Description cannot be empty")
		.bail(),
];

const getTrackedItemValidation = [
	check("project_id")
		.trim()
		.notEmpty()
		.withMessage("Project Id cannot be empty")
		.bail(),
	check("item_id")
		.trim()
		.notEmpty()
		.withMessage("item Id cannot be empty")
		.bail(),
];

const getTrackedItemsValidation = getTrackedUsersValidation;

const validator = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		return res.status(400).json({ errors: errors.array() });
	next();
};

module.exports = {
	validator,
	putTrackedUserValidation,
	getTrackedUserValidation,
	getTrackedUsersValidation,
	putTrackedItemValidation,
	getTrackedItemValidation,
	getTrackedItemsValidation,
};
