import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const registerValidationUser = [
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
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(422).json({ errors: errors.array() });
		next();
	},
];



export const loginValidationUser = [
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
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(422).json({ errors: errors.array() });
		next();
	},
];