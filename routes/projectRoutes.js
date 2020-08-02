const express = require("express");
const router = express.Router();

const projectController = require("../controllers/project");
const beaconsController = require("../controllers/beacon-info");
const verifyBimPlusToken = require("../middlewares/authentication/verifyBimPlusToken");
// const projectValidator = require("../middlewares/validators/user");

//wrapper to catch errors
let wrapper = (fn) => (...args) => fn(...args).catch(args[2]);

/**
 * @api {post} projects Update List of Projects
 * @apiName UpdateProjectList
 * @apiGroup Project
 * @apiDescription Get List of Projects
 *
 * @apiSuccess  (Success 200) {String} message Message indicating status
 *
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *   {
 *       "message": "Successfully Updated List of Projects.",
 *   }
 *   or
 *   {
 *       "message": "List of Projects up to Date.",
 *   }
 *
 */
router.post(
	"/update",
	verifyBimPlusToken,
	wrapper(projectController.updateProjects)
);

/**
 * @api {get} projects Get List of Projects
 * @apiName Get List Of Projects
 * @apiGroup Project
 * @apiDescription Gets a list of the projects available at Bimplus.
 *
 * @apiSuccess  (Success 200) {Object[]} projects List of all the projects available.
 * @apiSuccess  (No Content 204) {-} - -
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 *{
 *    "projects": [
 *        {
 *            "id_bimplus": "a7fe022a-bf34-4d73-814a-797eeb5889e6",
 *            "name": "Bimplus Demo",
 *            "slug": "bimplus-demo"
 *        }
 *      ]
 *}
 */
router.get("", verifyBimPlusToken, wrapper(projectController.getProjects));

//TODO: Add documentation
//should return info of project & registered beacons
router.get(
	"/:project_id",
	verifyBimPlusToken,
	wrapper(projectController.getProject)
);

//TODO: Add Documentation
//list available models
router.get(
	"/:project_id/models",
	verifyBimPlusToken,
	wrapper(projectController.getModels)
);

//TODO Add Documentation
//Defines Model that contains the Beacons
router.post(
	"/:project_id/beacons-model",
	verifyBimPlusToken,
	wrapper(projectController.setBeaconsModel)
);

//TODO Add Documentation
//Removes Model that contains the Beacons
router.delete(
	"/:project_id/beacons-model",
	verifyBimPlusToken,
	wrapper(projectController.deleteBeaconsModel)
);

router.get(
	"/:project_id/beacons-model",
	verifyBimPlusToken,
	wrapper(projectController.getBeaconsModel)
);
//TODO: Add Documentation and implementation, should return list of all available beacons and registered beacons.
//router.get('/:project_id/beacons',verifyBimPlusToken,wrapper(beaconsController.getAllBeacons))

//router.get('/:project_id/beacons/available-beacons',verifyBimPlusToken,wrapper(beaconsController.getAvailableBeacons))
module.exports = router;
