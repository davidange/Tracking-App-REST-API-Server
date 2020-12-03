const jwt = require("jsonwebtoken");

/**
 * Middleware for authenticating the token passed in HTTP request.
 */
module.exports = (req, res, next) => {
	const authHeader = req.get("Authorization");
	//if no token header
	if (!authHeader) {
		const error = new Error("Not Authenticated");
		error.statusCode = 401;
		throw error;
	}

	//if token header
	const token = authHeader.split(" ")[1];
	let decodedToken;
	if (!token) {
		const error = new Error("Invalid Format Token");
		error.statusCode = 400;
		throw error;
	}
	try {
		decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
	} catch (err) {
		err.statusCode = 500;
		throw err;
	}
	if (!decodedToken) {
		const error = new Error("Not Authenticated");
		error.statusCode = 401;
		throw error;
	}
	//if authenticated saved inside Request so that it can be accessed in other middlewares
	req.userId = decodedToken._id;
	next();
};
