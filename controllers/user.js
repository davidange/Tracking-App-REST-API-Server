import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
	const body = req.body ;

	const name = body.name;
	const email = body.email;
	const password = body.password;

	//Check if User is already in DB
	const emailExists = await User.findOne({ email: email });
	if (emailExists) {
		return res.status(400).send("User with that email already exists.");
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
		res.status(201).send({
			message: "Success!",
			user: user._id,
		});
	} catch (err) {
		res.status(400).send(err);
	}
};

export const loginUser = async (req, res) => {
	const body = req.body;

	const email = body.email;
	const password = body.password;

	//Check if User is already in DB
	const user = await User.findOne({ email: email });

	if (user) {
		//Pasword is correct?
		const validPass = await bcrypt.compare(password, user.password);
		if (validPass) {
			//loggin succesfull
			const token = jwt.sign({ _id: user._id },process.env.TOKEN_SECRET);
			return res.status(200).header('auth-token',token).send('Successfully logged in!');
		
		}
	}
	return res.status(400).send("Email or password is wrong");
};
