const Project = require("../models/project");
const Model = require("../models/model/model");
const BeaconsModel = require("../models/model/beacons-model");
const bimPlusServices = require("./bim-plus-services");
const additionalFunctions = require("./additional-functions");
const beacon = require("../controllers/beacon-info");

/**
 * Updates the list of Projects in the Database
 * TODO : Define what happens when project is removed.
 * @param  {String} bimPlusAuthToken Bim Plus Authentication Token
 * @returns {JSON} Array of projects available
 */
const update = async (bimPlusAuthToken) => {
	let allProjects = [];
	const teams = await bimPlusServices.getTeams(bimPlusAuthToken);

	for (team of teams) {
		const projects = await bimPlusServices.getProjects(
			bimPlusAuthToken,
			team.slug
		);
		//update list of projects in database
		for (project of projects) {
			project.team_name = team.name;
			project.team_id = team._id;
			//get List of models for that project
			const models = await bimPlusServices.getModels(
				bimPlusAuthToken,
				team.slug,
				project._id
			);
			const update = {
				slug: team.slug,
				name: project.name,
				team_name: team.name,
				team_id: team.team_id,
				models: models,
			};
			let doc = await Project.findByIdAndUpdate(project._id, update, {
				new: true,
				upsert: true,
			}); //updates main document
			//updates subdocuments of models
		}
		allProjects = [...allProjects, ...projects];
	}
	return allProjects;
};
/**
 * Gets list of all Projects saved on Database
 * @returns list of All Projects saved on Db
 */
const getAll = async () => {
	let projects = await Project.find({}, { name: 1, slug: 1, team_name: 1 });
	if (projects === null || projects.length === 0) {
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

const getModels = async (projectId) => {
	const models = await Project.findById(projectId, { models: 1, _id: 0 });
	if (models === null) {
		const error = new Error("Project with that ID does not exist.");
		error.statusCode = 404;
		throw error;
	}
	return models.models;
};

const setBeaconsModel = async (projectId, modelId, bimPlusAuthToken) => {
	const project = await get(projectId);
	if (project.beacons_model !== null && project.beacons_model !== undefined) {
		const error = new Error(
			"There is already a model defined that should contain beacons. Remove that model first"
		);
		error.statusCode = 403;
		throw error;
	}

	//validate  that model is a model from the selected project
	const models = await getModels(projectId);
	const foundModel = models.find((model) => model._id === modelId);

	if (foundModel) {
		//getTopologyTree of Model
		const topologyTree = await bimPlusServices.getObjectTree(
			bimPlusAuthToken,
			project.slug,
			foundModel.id_topology
		);
		//flatten tree
		const flattenTopologyTree = additionalFunctions.flatten(
			topologyTree,
			"children"
		);

		//filter only Beacon Elements
		const filteredFlatTopTree = flattenTopologyTree.filter(
			(element) =>
				element.type === "GeometryObject" &&
				element.name.toLowerCase().includes("beacon")
		);

		if (!filteredFlatTopTree.length > 0) {
			const error = new Error(
				"Model Does not contains any Beacon Object modeled with type GeometryObject, Beacons must have 'beacon' it its name."
			);
			error.statusCode = 500;
			throw error;
		}

		//for Each Beacon, obtain its coordinates
		//run in parallel requests
		const beaconsGeometricDataPromises = filteredFlatTopTree.map(
			(beaconBasicData) =>
				bimPlusServices.getObjectTreeWithPropertyList(
					bimPlusAuthToken,
					project.slug,
					beaconBasicData.id
				)
		);
		const beaconsGeometricData = await Promise.all(
			beaconsGeometricDataPromises
		);

		// combine Beacon Data
		const beacons = [];
		for (let index = 0; index < beaconsGeometricData.length; index++) {
			const beaconGData = beaconsGeometricData[index]; // geometric Beacon Data
			const beaconBData = filteredFlatTopTree[index]; //basic Beacon Data
			beacons.push({
				_id: beaconGData.objects[0].id,
				name: beaconBData.name,
				location: {
					x: beaconGData.viewbox.x,
					y: beaconGData.viewbox.y,
					z: beaconGData.viewbox.z,
				},
			});
		}

		project.beacons_model = new BeaconsModel({
			_id: modelId,
			beacons: beacons,
		});
		return await project.save();
	} else {
		const error = new Error("Model was Not Found");
		error.statusCode = 404;
		throw error;
	}
};

const getBeaconsModel = async (projectId) => {
	const beaconsModel = await Project.findById(projectId);
	if (beaconsModel === null) {
		const error = new Error("Project was Not Found");
		error.statusCode = 404;
		throw error;
	}
	const beaconId = beaconsModel.beacons_model._id;
	const beaconsModelInfo = beaconsModel.models.id(beaconId);
	return {
		...beaconsModel.beacons_model.toObject(),
		...beaconsModelInfo.toObject(),
	};
};

const deleteBeaconsModel = async (projectId) => {
	const project = await get(projectId);
	project.beacons_model = undefined;
	await project.save();
};
module.exports = {
	update,
	get,
	getAll,
	setBeaconsModel,
	getModels,
	deleteBeaconsModel,
	getBeaconsModel,
};
