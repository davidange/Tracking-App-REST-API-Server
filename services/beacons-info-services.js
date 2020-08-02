const bimPlusServices = require("./bim-plus-services");
const Project = require("../models/project");

const getBeacons = async (projectId) => {
	const beacons = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
		_id: 0,
	});
	console.log(beacons)
	if(beacons === null){
		const error =new Error('Project Not found');
		error.statusCode=404;
		throw error
	}
	if (Object.keys(beacons.toJSON()).length === 0 ) {
		const error = new Error("There are no beacons");
		error.statusCode = 500;
		throw error;
    }
	return beacons.beacons_model.beacons;
};


module.exports={getBeacons}