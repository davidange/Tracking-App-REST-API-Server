const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const userValidator = require("../middlewares/validators/user");


router.post("/register", userValidator.registerValidationUser, userController.registerUser);

router.post("/login", userValidator.loginValidationUser, userController.loginUser);

module.exports = router;
