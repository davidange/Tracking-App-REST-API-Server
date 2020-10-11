const express = require("express");
const router = express.Router();

const trackingEntitiesController = require("../controllers/tracking-entities");
const verifyBimPlusToken = require("../middlewares/authentication/verifyBimPlusToken");
const verifyAccessToken = require("../middlewares/authentication/verifyToken");
const trackedEntitiesValidator = require("../middlewares/validators/tracking-entities");
//wrapper to catch errors
let wrapper = (fn) => (...args) => fn(...args).catch(args[2]);

router.put(
	"/:project_id/tracked-users",
	verifyBimPlusToken,
	verifyAccessToken,
	trackedEntitiesValidator.putTrackedUserValidation,
	trackedEntitiesValidator.validator,
	wrapper(trackingEntitiesController.putTrackedUser)
);

router.get(
	"/:project_id/tracked-users",
	verifyBimPlusToken,
	verifyAccessToken,
	trackedEntitiesValidator.getTrackedUsersValidation,
	trackedEntitiesValidator.validator,
	wrapper(trackingEntitiesController.getTrackedUsers)
);

router.get(
	"/:project_id/tracked-users/:user_id",
	verifyBimPlusToken,
	verifyAccessToken,
	trackedEntitiesValidator.getTrackedUserValidation,
	trackedEntitiesValidator.validator,
	wrapper(trackingEntitiesController.getTrackedUser)
);

router.put(
	"/:project_id/tracked-items",
	verifyBimPlusToken,
	verifyAccessToken,
	trackedEntitiesValidator.putTrackedItemValidation,
	trackedEntitiesValidator.validator,
	wrapper(trackingEntitiesController.putTrackedItem)
);

router.get(
	"/:project_id/tracked-items",
	verifyBimPlusToken,
	verifyAccessToken,
	trackedEntitiesValidator.getTrackedItemsValidation,
	trackedEntitiesValidator.validator,
	wrapper(trackingEntitiesController.getTrackedItems)
);

router.get(
	"/:project_id/tracked-items/:item_id",
	verifyBimPlusToken,
	verifyAccessToken,
	trackedEntitiesValidator.getTrackedItemValidation,
	trackedEntitiesValidator.validator,
	wrapper(trackingEntitiesController.getTrackedItem)
);


module.exports = router;