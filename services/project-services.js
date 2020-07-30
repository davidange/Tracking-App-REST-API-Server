const Project = require("../models/project");
const Model = require("../models/model/model");
const BeaconsModel=require('../models/model/beacons-model')
const bimPlusServices = require("./bim-plus-services");
/**
 * Updates the list of Projects in the Database
 * TODO : Define what happens when project is removed.
 * @param  {String} bimPlusAuthToken Bim Plus Authentication Token
 * @returns {JSON} Array of projects available
 */
const update = async (bimPlusAuthToken) => {
	const projects = await bimPlusServices.getProjects(bimPlusAuthToken);
	console.log(' -----------------------')
	console.log(projects)
	//update list of projects in database
	for (project of projects) {
		//get List of models
		const models = await bimPlusServices.getModels(bimPlusAuthToken, project.slug);
		const update = { slug: project.slug, name: project.name,models:models};
		let doc = await Project.findByIdAndUpdate(project._id, update, {
			new: true,
			upsert: true,
		});//updates main document
		//updates subdocuments of models
		
	

		
	}
	return projects;
};
/**
 * Gets list of all Projects saved on Database
 * @returns list of All Projects saved on Db
 */
const getAll = async () => {
	let projects = await Project.find({},{name:1,slug:1})
	if (projects === null) {
		const error = new Error("There are no Projects Registered.");
		error.statusCode = 404;
		throw error;
	}

	return projects;
};
/**
 * Get project that has same id as projectId
 * @param  {String} projectId
 * @returns project
 */
const get = async (projectId) => {
	const project = await Project.findById(projectId);
	if (project === null) {
		const error = new Error("Project was Not Found");
		error.statusCode = 404;
		throw error;
	}
	//return only usefult info
	return project;
};


const getModels=async(projectId)=>{
	const models = await Project.findById(projectId,{models:1,_id:0});
	return models.models
}

const setBeaconsModel=async(projectId,modelId,bimPlusAuthToken)=>{
	const project= await get(projectId);
	if((project.beacons_model!==null  && project.beacons_model!==undefined)){
		const error =new Error("There is already a model defined that should contain beacons. Remove that model first");
		error.statusCode = 403;
		throw error;
	}
	//validate  that model is a model from the selected project
	const models= await getModels(projectId);
	if(models.some(model=>model._id===modelId)){
		
		project.beacons_model=new BeaconsModel({_id:modelId})
		
		return await project.save();

	}else{
		const error = new Error("Model was Not Found");
		error.statusCode = 404;
		throw error;
	}
}

const deleteBeaconsModel=async(projectId)=>{
	const project= await get(projectId);
	project.beacons_model=undefined;
	await project.save();
	
}
module.exports = { update, get, getAll,setBeaconsModel,getModels ,deleteBeaconsModel};
