const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * Registers user if User is not in Database
 * @param  {String} name
 * @param  {String} email
 * @param  {String} password
 * @returns {User}
 */
const register = async (name, email, password) => {
	const user = await User.findOne({ email: email });
	if (user) {
		const error = new Error("User with that email already exists.");
		error.statusCode = 400;
		throw error;
	}

	//Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);
	//create New User
	const newUser = new User({
		name: name,
		email: email,
		password: hashPassword,
	});

	//save User
	return await newUser.save();
};

/**
 * Login user, creates Authentication Token for API if successful
 * @param  {String} email
 * @param  {String} password
 * @returns {Object}
 */
const login = async (email, password) => {
	const user = await User.findOne({ email: email });
	//user Found
	if (user !== null) {
		const validPassword = await bcrypt.compare(password, user.password);
		if (validPassword) {
			const token = jwt.sign(
				{
					email: email,
					_id: user._id,
				},
				process.env.TOKEN_SECRET,
				{
					expiresIn: "1h",
				}
			);
			return {
				token: token,
				expires_in: 3600,
			};
		}
	}
	//user Not found or Password not validated
	const error = new Error("User or Password are invalid");
	error.statusCode = 400;
	throw error;
};

module.exports = {login,register}