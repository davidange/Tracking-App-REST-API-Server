const Project = require("../models/project");
const bimPlusServices = require("./bim-plus-services");
/**
 * Updates the list of Projects in the Database
 * TODO : Define what happens when project is removed.
 * @param  {String} bimPlusAuthToken Bim Plus Authentication Token
 * @returns {JSON} Array of projects available
 */
const update = async (bimPlusAuthToken) => {
	const projects = await bimPlusServices.getProjects(bimPlusAuthToken);

	//update BimPlus list of projects
	for (project of projects) {
		const filter = { id_bimplus: project.id_bimplus };
		const update = { slug: project.slug, name: project.name };
		let doc = await Project.findOneAndUpdate(filter, update, {
			new: true,
			upsert: true,
		});
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

	//return only usable Data
	projects = projects.map((project) => {
		return {
			name: project.name,
			id_bimplus: project.id_bimplus,
			id: project._id,
		};
	});
	return projects;
};
/**
 * Get project that has same id as projectId
 * @param  {String} projectId
 * @returns project
 */
const get = async (projectId) => {
	let project = await Project.findOne({ _id: projectId });
	if (project === null) {
		const error = new Error("Project was Not Found");
		error.statusCode = 404;
		throw error;
	}
	//return only usefult info
	const projectSimplified = {
		name: project.name,
		id_bimplus: project.id_bimplus,
		id: project._id,
	};
	return projectSimplified;
};

const getModels = async (bimPlusAuthToken,projectId) => {
    const project = await Project.findOne({ _id: projectId });
    const slug= project.slug;
    const models= await bimPlusServices.getModels(bimPlusAuthToken,slug);
    return models

};
module.exports = { update, get, getAll, getModels };
