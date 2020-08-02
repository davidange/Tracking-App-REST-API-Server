const bimPlusServices = require("./bim-plus-services");
const Project = require("../models/project");

const getBeacons = async (projectId) => {
	const beacons = await Project.findById(projectId, {
		"beacons_model.beacons": 1,
		_id: 0,
	});
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

const getActiveBeacons=async (projectId) =>{
	const beacons=await getBeacons(projectId);
	const activeBeacons=beacons.filter(beacon=>beacon.is_active===true);
	return activeBeacons;
}


const getBeacon=async(projectId,beaconId)=>{
	const project=await Project.findById(projectId,{'beacons_model.beacons':1});
	const beacon=project.beacons_model.beacons.id(beaconId);
	if(project === null){
		const error = new Error("Project/Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}
	return(beacon);
}


const setBeaconUID=async(projectId,beaconId,beaconUID)=>{
	const project=await Project.findById(projectId,{'beacons_model.beacons':1});
	const beacon=project.beacons_model.beacons.id(beaconId);
	if(project === null){
		const error = new Error("Project/Beacon Was not Found");
		error.statusCode = 404;
		throw error;
	}
	beacon.uid_beacon=beaconUID;
	console.log(beacon)
	await beacon.save(); //validate Subdocument Beacon
	await project.save();//save Project Document
	return beacon
}

module.exports={getBeacons,getActiveBeacons,getBeacon,setBeaconUID}