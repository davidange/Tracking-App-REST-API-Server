const Project = require("../models/project");
const projectServices = require("../services/project-services");

const updateProjects = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"];
	try {
		const projects = await projectServices.update(bimPlusAuthToken);
		return res.status(201).send({
			message: "Successfully Updated List of Projects.",
			projects: projects,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getProjects = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"];
	try {
		const projects = await projectServices.getAll(bimPlusAuthToken);
		if (projects.length === 0) {
			return res.status(204).send();
		}
		return res.status(200).send({
			projects: projects,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getProject = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"]; // already verified that exists through middleware
	const projectId = req.params.project_id;
	//TODO ADD middleware Validator for ID
	try {
		const project = await projectServices.get(projectId);
		return res.status(200).send({
			project: project,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getModels = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"]; // already verified that exists through middleware
	const projectId = req.params.project_id;
	//TODO Add Middleware Validator
	try {
		const models = await projectServices.getModels(bimPlusAuthToken, projectId);
		return res.status(200).send({
			models: models,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};



module.exports = { updateProjects, getProjects, getProject, getModels };
