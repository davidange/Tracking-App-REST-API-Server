const express = require("express");
const router = express.Router();

const beaconsController = require("../controllers/beacon-info");
const verifyBimPlusToken = require("../middlewares/authentication/verifyBimPlusToken");

//wrapper to catch errors
let wrapper = (fn) => (...args) => fn(...args).catch(args[2]);


router.get(
	"/:project_id/beacons",
	verifyBimPlusToken,
	wrapper(beaconsController.getBeacons)
);

module.exports = router;