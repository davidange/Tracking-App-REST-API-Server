const beaconInfoServices=require('../services/beacons-info-services');

const getBeacons = async (req, res) => {
	const projectId = req.params.project_id;
	try {
		const beacons=await beaconInfoServices.getBeacons(projectId);
		return res.status(200).send({
			beacons: beacons,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};


const getActiveBeacons = async (req, res) => {
	const projectId = req.params.project_id;
	try {
		const beacons=await beaconInfoServices.getActiveBeacons(projectId);
		return res.status(200).send({
			active_beacons: beacons,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};


const getBeacon=async(req, res)=>{
	const projectId = req.params.project_id;
	const beaconId=req.params.beacon_id;
	try {
		const beacon=await beaconInfoServices.getBeacon(projectId,beaconId);
		return res.status(200).send({
			beacon: beacon,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}

}


const setBeaconUID=async(req, res)=>{
	const projectId = req.params.project_id;
	const beaconId=req.params.beacon_id;
	const beaconUID=req.body.beacon_uid;
	console.log(beaconUID)
	try {
		const beacon=await beaconInfoServices.setBeaconUID(projectId,beaconId,beaconUID);
		return res.status(200).send({
			beacon: beacon,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}

}

module.exports = { getBeacons,getActiveBeacons ,getBeacon, setBeaconUID};
