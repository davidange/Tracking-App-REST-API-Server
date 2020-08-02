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

module.exports = { getBeacons };
