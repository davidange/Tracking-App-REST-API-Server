const axios = require("axios");
const Project=require('../models/project')
/**
 * @param  {String} access_token Bim Plus Access Token
 * @returns {JSON} list of Projects available
 */
const getProjects = async (access_token) => {
	const headers = {
		Authorization: "BimPlus " + access_token,
	};
	const response = await axios.get("https://api-stage.bimplus.net/v2/teams", {
		headers,
	});
	const projects = response.data;
	//cleans the  data to return only usable Info
	const projectsList = [];
	for (project of projects) {
		projectsList.push(
			{
				slug: project.slug,
				name: project.name,
				_id: project.id,
			}
		);
	}

	return projectsList;
};
/**
 * Obtain list of Models for the project indicated by the slug parameter
 * @param  {String} access_token Bim Plus Access Token
 * @param  {String} slug Bim Plus project URL identifier
 * @returns {JSON} List of all Models
 */
const getModels = async (access_token, slug) => {
	const headers = {
		Authorization: "BimPlus " + access_token,
	};
	const response = await axios.get(
		"https://api-stage.bimplus.net/v2/" + slug + "/divisions",
		{
			headers,
		}
	);
	const models = response.data;
	const modelList = models.map((model) => {
		return {
			name: model.name,
			description: model.description,
			id_topology: model.topologyId,
			_id: model.id,
		};
	});

	return modelList;
};


module.exports = { getProjects, getModels };
