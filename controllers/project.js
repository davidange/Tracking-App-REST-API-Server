const Project = require("../models/project");
const axios = require("axios");

const updateProjects = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"]; // already verified that exists in middleware
	//Create model of each Project
	const projectsInfo = await getProjectsInfo(bimPlusAuthToken);
	const projects = [];
	for (projectInfo of projectsInfo) {
		const project = new Project({
			slug: projectInfo.slug,
			name: projectInfo.name,
			id_bimplus: projectInfo.id,
		});

		projects.push(project);
	}
	console.log("------------");
	console.log(projects);
	//
	try {
		for (project of projects) {
			//update model
			const filter = { id_bimplus: project.id_bimplus };
			const update = { slug: project.slug, name: project.name };
			let doc = await Project.findOneAndUpdate(filter, update, {
				new: true,
				upsert: true,
			});
			//note As of right now it does not delete projects(only updates them)
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}

	//TODO add logic to update/register projects in DB
	return res.status(201).send({
		message: "Successfully Updated List of Projects.",
	});
};

const getProjects = async (req, res) => {
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"]; // already verified that exists through middleware
	let projects = [];
	try {
		projects = await Project.find({});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}
	if (projects.length === 0) {
		return res.status(204);
	}
	return res.status(200).send({
		projects: projects,
	});
};

//Private function
const getProjectsInfo = async (access_token) => {
	const headers = {
		Authorization: "BimPlus " + access_token,
	};
	const response = await axios.get("https://api-stage.bimplus.net/v2/teams", {
		headers,
	});
	const data = response.data;
	return data;
};

module.exports = { updateProjects, getProjects };
