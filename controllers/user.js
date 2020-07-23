const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
	const body = req.body;

	const name = body.name;
	const email = body.email;
	const password = body.password;
	//Check if User is already in DB
	const emailExists = await User.findOne({ email: email });
	//user Already Exist
	if (emailExists) {
		const error = new Error("User with that email already exists.");
		error.statusCode = 400;
		error.data = errors.array();
		throw error;
		//return res.status(400).send("User with that email already exists.");
	}

	//Hash passwords
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);

	//create New User
	const user = new User({
		name: name,
		email: email,
		password: hashPassword,
	});

	try {
		const savedUser = await user.save();
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
	const body = req.body;
	const email = body.email;
	const password = body.password;

	//Check if User is already in DB
	try {
		const user = await User.findOne({ email: email });

		if (user) {
			//Pasword is correct?
			const validPass = await bcrypt.compare(password, user.password);
			if (validPass) {
				//loggin succesful
				//create token
				const token = jwt.sign(
					{
						_id: user._id,
					},
					process.env.TOKEN_SECRET,
					{
						expiresIn: "1h",
					}
				);
				return res
					.status(200)
					.header("auth-token", token)
					.send("Successfully logged in!");
			}
		}else {
			//not valid password OR user does not exist
			const error = new Error("Wrong password or Email!");
			error.statusCode = 401;
			throw error;
		}

	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err
	}
};

module.exports = {
	registerUser,
	loginUser,
};
