//** Middleware for preventing CORS errors  */

module.exports = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	if (req.methods === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, POST, DELETE, GET");
		return res.status(200).json({});
	}
	next();
};
