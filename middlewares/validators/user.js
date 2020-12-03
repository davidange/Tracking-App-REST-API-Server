const { check, validationResult } = require("express-validator");
/** 
 * Middlewares for validating user related requests.
*/

 const registerValidationUser = [
	check("name")
		.trim()
		.not()
		.isEmpty()
		.withMessage("User name can not be empty!")
		.bail()
		.isLength({ min: 6 })
		.withMessage("Minimum 6 characters required!")
		.bail(),
	check("email")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Email address cannot be Empty!")
		.bail()
		.isEmail()
		.withMessage("Not a valid Email format")
		.bail(),
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password cannot be Empty!"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });
		next();
	},
];

 const loginValidationUser = [
	check("email")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Email address cannot be Empty!")
		.bail()
		.isEmail()
		.withMessage("Not a valid Email format")
		.bail(),
	check("password")
		.trim()
		.not()
		.isEmpty()
		.withMessage("Password cannot be Empty!"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() });
		next();
	},
];


module.exports = {
	registerValidationUser,
	loginValidationUser
}
