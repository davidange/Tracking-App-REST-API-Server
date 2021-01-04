const { check, validationResult, oneOf, param } = require("express-validator");
/**
 * This file contains middlewares for validating the HTTP requests related to tracked entities and
 * a middleware for returning a response if the request body was invalid.
 */

const putTrackedEntityValidation = [
	check("project_id").trim().notEmpty().withMessage("Project Id cannot be empty").bail(),

	check("location_method")
		.trim()
		.not()
		.isEmpty()
		.withMessage("The Method to calculate the location cannot be Empty")
		.custom((value) => {
			if (value === "beacon-trilateration" || value === "gps_location"||value === "beacon-trilateration-2" ) return true;
			throw new Error("The Method is not implemented")
		})
		.bail(),
	oneOf([
		[
			check("measurement_data.*.distance")
				.exists()
				.withMessage("Measurement Data is not valid")
				.custom((value) => {
					//if it is numeric
					if (!isNaN(value)) {
						return true;
					} //if it is an Array, check that all elements are numbers...
					if (Array.isArray(value)) {
						value.forEach((element) => {
							if (isNaN(element)) {
								throw new Error("Measurement Data is not valid");
							}
						});
						return true;
					}
					throw new Error("Measurement Data is not valid");
				})
				.bail(),
			check("measurement_data.*.beacon_uid")
				.exists()
				.withMessage("Measurement Data is not valid")
				.isString()
				.withMessage("Measurement Data is not valid")
				.bail(),
		],
	]),
];

const putTrackedUserValidation = putTrackedEntityValidation;

const getTrackedUserValidation = [
	check("project_id").trim().notEmpty().withMessage("Project Id cannot be empty").bail(),
	check("user_id").trim().notEmpty().withMessage("Project Id cannot be empty").bail(),
];

const getTrackedUsersValidation = [
	check("project_id").trim().notEmpty().withMessage("Project Id cannot be empty").bail(),
];

const putTrackedItemValidation = [
	...putTrackedEntityValidation,
	check("item_id").trim().notEmpty().withMessage("Item Id cannot be empty").bail(),
	check("item_name").trim().notEmpty().isString().withMessage("Item Name cannot be empty").bail(),
	check("item_description").trim().notEmpty().isString().withMessage("Item Description cannot be empty").bail(),
];

const getTrackedItemValidation = [
	check("project_id").trim().notEmpty().withMessage("Project Id cannot be empty").bail(),
	check("item_id").trim().notEmpty().withMessage("item Id cannot be empty").bail(),
];

const getTrackedItemsValidation = getTrackedUsersValidation;

//Middleware for returning errors if validation did not succeed.
const validator = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
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
