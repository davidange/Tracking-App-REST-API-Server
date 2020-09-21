const getBimPlusToken = require("../util/BimPlus/getBimPlusToken");
/*
	This .js file sets up an interval so that it generates periodically a token to autenticate the app 
	with the BimPlus API.
*/

module.exports = function (app) {
	//get token Data for the first Time
	setTimeout(async () => {
		//get authentication Token
		const bimPlusTokenData = await getBimPlusToken.requestAutenticationToken(
			process.env.BIMPLUS_USER,
			process.env.BIMPLUS_PASSWORD,
			process.env.BIMPLUS_APPLICATION_ID
		);
		app.set("BimPlusToken", bimPlusTokenData);
    }, 1000);
	//update expires_in
    setInterval(() => {
        if(app.get("BimPlusToken")){
            app.get("BimPlusToken")["expires_in"]--;
        }
    }, 1000);

	//update every hour Token Data
	setInterval(async () => {
		
		bimPlusTokenData = await getBimPlusToken.requestAutenticationToken(
			process.env.BIMPLUS_USER,
			process.env.BIMPLUS_PASSWORD,
			process.env.BIMPLUS_APPLICATION_ID
		);
		app.set("BimPlusToken", bimPlusTokenData);
	}, 3600000);
};
