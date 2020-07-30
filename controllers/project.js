const projectServices = require("../services/project-services");

const updateProjects = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"];
	try {
		const projects = await projectServices.update(bimPlusAuthToken);
		return res.status(201).send({
			message: "Successfully Updated List of Projects & Its Models",
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
		const models = await projectServices.getModels(projectId);
		return res.status(200).send({
			models,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const setBeaconsModel = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"];
	const projectId = req.params.project_id;
	const modelId = req.body.model_id;
	try {
		await projectServices.setBeaconsModel(projectId, modelId, bimPlusAuthToken);
		return res.status(200).send({
			message: "Successfully set Beacons Model",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const deleteBeaconsModel = async (req, res) => {
	const projectId = req.params.project_id;
	try {
		await projectServices.deleteBeaconsModel(projectId);
		return res.status(200).send({
			message: "Successfully Removed Beacons Model",
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

const getBeaconsModel = async (req, res) => {
	const projectId = req.params.project_id;
	try {
		const model = await projectServices.getBeaconsModel(projectId);
		console.log(model);
		return res.status(200).send({
			model: model,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
};

module.exports = {
	updateProjects,
	getProjects,
	getProject,
	getModels,
	setBeaconsModel,
	deleteBeaconsModel,
	getBeaconsModel,
};
