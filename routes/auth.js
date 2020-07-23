const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const userValidator = require("../middlewares/validators/user");

/**
* @api {post} /register Register a New User
* @apiName RegisterUser
* @apiGroup User
*
* @apiParam {String{6..}} name
* @apiParam {String} email
* @apiParam {String} password
*/
router.post("/register", userValidator.registerValidationUser, userController.registerUser);

router.post("/login", userValidator.loginValidationUser, userController.loginUser);

module.exports = router;
