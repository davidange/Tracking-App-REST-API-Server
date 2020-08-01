const axios = require("axios");
const Project=require('../models/project')
/**
 * @param  {String} access_token Bim Plus Access Token
 * @returns {JSON} list of Teams available
 */
const getTeams = async (access_token) => {
	const headers = {
		Authorization: "BimPlus " + access_token,
	};
	const response = await axios.get("https://api-stage.bimplus.net/v2/teams", {
		headers,
	});
	const teams = response.data;
	//cleans the  data to return only usable Info
	const teamsList = [];
	for (team of teams) {
		teamsList.push(
			{
				slug: team.slug,
				name: team.name,
				_id: team.id,
			}
		);
	}

	return teamsList;
};




/**
 * @param  {String} access_token Bim Plus Access Token
* @param  {String} slug Bim Plus team URL identifier
 * @returns {JSON} list of Projects available
 */
const getProjects = async (access_token, slug) => {
	const headers = {
		Authorization: "BimPlus " + access_token,
	};
	const response = await axios.get("https://api-stage.bimplus.net/v2/"+slug+"/projects", {
		headers,
	});
	const projects = response.data;
	//cleans the  data to return only usable Info
	const projectsList = [];
	for (project of projects) {
		projectsList.push(
			{
				slug: slug,
				name: project.name,
				_id: project.id,
			}
		);
	}

	return projectsList;
};



/**
 * Obtain list of Models of Project
 * @param  {String} access_token Bim Plus Access Token
 * @param  {String} slug Bim Plus team URL identifier
 * @param {String} projectId Bim Plus ID of project
 * @returns {JSON} List of all Models
 */
const getModels = async (access_token, slug,projectId) => {
	const headers = {
		Authorization: "BimPlus " + access_token,
	};
	const response = await axios.get(
		"https://api-stage.bimplus.net/v2/" + slug +"/projects/"+projectId+ "/divisions",
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


module.exports = {getTeams, getProjects, getModels };
