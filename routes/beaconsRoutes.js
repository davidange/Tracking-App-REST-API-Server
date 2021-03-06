const express = require("express");
const router = express.Router();

const beaconsController = require("../controllers/beacon-info");
const verifyBimPlusToken = require("../middlewares/authentication/verifyBimPlusToken");
const verifyAccessToken = require("../middlewares/authentication/verifyToken");
//wrapper to catch errors
let wrapper = (fn) => (...args) => fn(...args).catch(args[2]);

/**
 * @api {get} /projects/:project_id/beacons Get List of Beacons
 * @apiName Get List Of Beacons
 * @apiGroup Beacons
 * @apiDescription Gets a list of the Beacons in current Project
 *
 * @apiHeader {String} access-token User token generated by login in.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "TrackingAPI your-access-token-here"
 *     }
 * 
 * @apiSuccess  (Success 200) {Object[]} beacons List of all the beacons.
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "beacons": [
 *        {
 *            "is_active": false,
 *            "_id": "3fe89152-46fc-428a-ba8a-18a165b92a91",
 *            "name": "Beacon7:Beacon:2439889",
 *            "location": {
 *                "x": -8680.2,
 *                "y": 6270,
 *                "z": 7009.4
 *            }
 *        },...
 *    ]
 *}
 */
router.get(
	"/:project_id/beacons",
	verifyBimPlusToken,
	verifyAccessToken,
	wrapper(beaconsController.getBeacons)
);

/**
 * @api {get} /projects/:project_id/active-beacons Get List of Active Beacons
 * @apiName Get List Of Active Beacons
 * @apiGroup Beacons
 * @apiDescription Gets a list of the Active Beacons in current Project
 *
 * @apiHeader {String} access-token User token generated by login in.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "TrackingAPI your-access-token-here"
 *     }
 * 
 * @apiSuccess  (Success 200) {Object[]} beacons List of all the Active Beacons.
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "beacon": 
 *        {
 *            "is_active": true,
 *            "_id": "3fe89152-46fc-428a-ba8a-18a165b92a91",
 *            "id_beacon": "beaconIdentifier"
 *            "name": "Beacon7:Beacon:2439889",
 *            "location": {
 *                "x": -8680.2,
 *                "y": 6270,
 *                "z": 7009.4
 *            }
 *        }
 *    
 *}
 */
router.get(
	"/:project_id/active-beacons",
	verifyBimPlusToken,
	verifyAccessToken,
	wrapper(beaconsController.getActiveBeacons)
);



/**
 * @api {get} /projects/:project_id/beacons/:beacon_id Get information of Beacon
 * @apiName Get information of Beacon
 * @apiGroup Beacons
 * @apiDescription Gets the information about the beacon indicated by beacon_id
 *
 * @apiHeader {String} access-token User token generated by login in.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "TrackingAPI your-access-token-here"
 *     }
 * 
 * @apiSuccess  (Success 200) {Object} beacon information about the current beacon
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "beacons": [
 *        {
 *            "is_active": true,
 *            "_id": "3fe89152-46fc-428a-ba8a-18a165b92a91",
 *            "id_beacon": "beaconUID"
 *            "name": "Beacon7:Beacon:2439889",
 *            "location": {
 *                "x": -8680.2,
 *                "y": 6270,
 *                "z": 7009.4
 *            }
 *        },...
 *    ]
 *}
 */
router.get(
	"/:project_id/beacons/:beacon_id",
	verifyBimPlusToken,
	verifyAccessToken,
	wrapper(beaconsController.getBeacon)
);


/**
 * @api {patch} /projects/:project_id/beacons/:beacon_id Set UID of Beacon
 * @apiName Set information of Beacon
 * @apiGroup Beacons
 * @apiDescription Sets the UID of the beacon. This is the identifier that the beacon transmits.
 *
 * @apiHeader {String} access-token User token generated by login in.
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Authorization": "TrackingAPI your-access-token-here"
 *     }
 * @apiParam {String} beacon_UID UID of the beacon. If empty, it will set the UID Beacon as None and set the beacon as inactive.
 * @apiSuccess  (Success 200) {String} message information about the current update status
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "message": "Success."
 *
 */
router.patch(
	"/:project_id/beacons/:beacon_id",
	verifyBimPlusToken,
	verifyAccessToken,
	wrapper(beaconsController.setBeaconUID)
);
module.exports = router;
