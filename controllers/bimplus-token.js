/**
 * Middleware that gives the bimplus Token
 */
const getToken = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"];
	return res.status(200).send({
		message: "Successfully Updated List of Projects & Its Models",
		token: bimPlusAuthToken,
	});
};

module.exports = { getToken };
