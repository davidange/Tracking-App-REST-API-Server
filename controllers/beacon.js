const Beacon = require("../models/beacon");
const Project=require('../models/project')
const axios = require("axios");


const getAvailableBeacons=async(req,res)=>{
	const bimPlusAuthToken = req.app.get("BimPlusToken")["access_token"]; // already verified that exists through middleware
	const id = req.params.project_id;

	//validate id 
	if(!require('mongoose').Types.ObjectId.isValid(id)){
		console.log("Not Found")
		return res.status(404).send();
	}

	try{
		let project = await Project.findOne({ _id: id });
		if (project===null){
			return res.status(404).send();
		}
		const modelList=getModelList(bimPlusAuthToken,project.slug);
		console.log(modelList)

	}catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		throw err;
	}

}





//Private function
const getModelList = async (access_token,slug) => {

    const headers = {
        Authorization: 'BimPlus ' + access_token
    }
    const response = await axios.get(
        'https://api-stage.bimplus.net/v2/'+slug+'/divisions', {
            headers
        }
    )
    const data = await response.data;
    console.log(data);
    return data
}

module.exports = {getAvailableBeacons}