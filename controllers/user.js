const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userServices = require("../services/user-services");

const registerUser = async (req, res, next) => {
	const { name, email, password } = req.body;
	try {
		const user = await userServices.register(name, email, password);
		return res.status(201).send({
			message: "Success!",
			user: user._id,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const tokenCredentials = await userServices.login(email, password);

		return res.status(200).send({
			message: "Successfully logged in!",
			token: tokenCredentials.token,
			expires_in: tokenCredentials.expires_in,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

module.exports = {
	registerUser,
	loginUser,
};
