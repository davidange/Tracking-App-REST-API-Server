//verifies that controller/middleware has access to the BimPlus authentication Token

module.exports = (req, res, next) => {
    const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"];
	if (!bimPlusAuthToken) {
		const error = new Error("Server could not authenticate with BimPlus API");
		error.statusCode = 500;
		throw error;
	}
	next();
};
