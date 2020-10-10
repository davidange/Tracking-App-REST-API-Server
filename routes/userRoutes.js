const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const userValidator = require("../middlewares/validators/user");

//wrapper to catch errors
let wrapper = (fn) => (...args) => fn(...args).catch(args[2]);

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
router.post(
	"/register",
	userValidator.registerValidationUser,
	wrapper(userController.registerUser)
);

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
 * @apiSuccess {String} token Token which can be used for further API calls.
 * @apiSuccess {number} expires_in Number of seconds that the token is still valid.
 *
 * @apiSuccessExample {json} Success-Response
 *   HTTP/1.1 200 OK
 * {
 *    "message": "Successfully logged in!",
 *    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHRlc3QuY29tIiwiX2lkIjoiNWYxYWI4ZDJiMjI5NzYxYzVjY2RkNDhiIiwiaWF0IjoxNTk1NjAyNjgwLCJleHAiOjE1OTU2MDYyODB9.7HvWH_M7Da98ivrXFvMiMhmUwHJyvd_mOTJzdP2nFvc",
 *    "expires_in": 3600
 * }
 *
 */
router.post(
	"/login",
	userValidator.loginValidationUser,
	wrapper(userController.loginUser)
);

module.exports = router;
