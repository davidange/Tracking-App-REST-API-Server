import { Request, Response } from "express";
import User from "../models/user";


export const registerUser = async (req: Request, res: Response) => {
	const body = req.body as { name: string; email: string; password: string };

	
	const name = body.name;
	const email = body.email;
	const password = body.password;

	const user = new User({
		name: name,
		email: email,
		password: password,
	});

	try {
		const savedUser = await user.save();
		res.status(201).send(savedUser);
	} catch (err) {
		res.status(400).send(err);
	}
};
