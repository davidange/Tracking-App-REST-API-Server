const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const userValidator = require("../middlewares/validators/user");


//wrapper to catch errors 
let wrapper = fn => (...args) => fn(...args).catch(args[2]);

/**
* @api {post} user/register Register a New User
* @apiName RegisterUser
* @apiGroup User
* @apiDescription Creates and register new user to database.
*
* @apiParam {String{6..}} name
* @apiParam {String} email
* @apiParam {String} password
*
* @apiSuccess  (Success 201) {String} message Message indicating status
* @apiSuccess  (Success 201) {String} user Id of the user that was just created.
*
* @apiSuccessExample {json} Success-Response
*   HTTP/1.1 201 OK
*   {
*       "message": "Success!",
*        "user": "5f1ab8d2b229761c5ccdd48b"
*   }
*/
router.post("/register", userValidator.registerValidationUser,wrapper(userController.registerUser));


/**
* @api {post} user/login Login
* @apiName LoginUser
* @apiGroup User
* @apiDescription Creates a token to authenticate user
*
* @apiParam {String} email
* @apiParam {String} password
*
* @apiSuccess {String} message Message indicating status
* @apiSuccess {String} auth-token Token which can be used for further API calls.
*
* @apiSuccessExample {json} Success-Response
*   HTTP/1.1 200 OK
*   {
*       "message": "Succesfully!",
*   }
*   header:
*  { auth-token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}
*
*/
router.post("/login", userValidator.loginValidationUser, wrapper(userController.loginUser));

module.exports = router;
