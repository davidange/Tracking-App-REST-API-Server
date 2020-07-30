const Project = require("../models/project");
const Model = require("../models/model/model");
const bimPlusServices = require("./bim-plus-services");
/**
 * Updates the list of Projects in the Database
 * TODO : Define what happens when project is removed.
 * @param  {String} bimPlusAuthToken Bim Plus Authentication Token
 * @returns {JSON} Array of projects available
 */
const update = async (bimPlusAuthToken) => {
	const projects = await bimPlusServices.getProjects(bimPlusAuthToken);

	//update list of projects in database
	for (project of projects) {
		//get List of models
		const models = await bimPlusServices.getModels(bimPlusAuthToken, project.slug);
		console.log(' -----------------------')
		const update = { slug: project.slug, name: project.name};
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
	let projects = await Project.find({});
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
	let project = await Project.findById(projectId);
	if (project === null) {
		const error = new Error("Project was Not Found");
		error.statusCode = 404;
		throw error;
	}
	//return only usefult info
	return project;
};


module.exports = { update, get, getAll };
