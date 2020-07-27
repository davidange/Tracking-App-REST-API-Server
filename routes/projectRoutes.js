const express = require("express");
const router = express.Router();

 const projectController = require("../controllers/project");
 const verifyBimPlusToken=require('../middlewares/authentication/verifyBimPlusToken');
// const projectValidator = require("../middlewares/validators/user");

//wrapper to catch errors 
let wrapper = fn => (...args) => fn(...args).catch(args[2]);



/**
* @api {post} projects/update Update List of Projects
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
router.post("/update",verifyBimPlusToken,wrapper(projectController.updateProjects));



/**
* @api {get} projects/get_all Get List of Projects
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
router.get('/get_all',verifyBimPlusToken,wrapper(projectController.getProjects));


module.exports=router;