const getBimPlusToken = require("../util/BimPlus/getBimPlusToken");

//set Interval to update the BimPlus Token every Hour
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
