const axios = require("axios");



/**
* Returns the authorization Token Data for using BimPlusAPI
* @param {String} email Credential for login in
* @param {String} password user's password
* @param {String} applicationId The id of the application From BimPlus
* @return {JSON} Json object representing data from BimPlus
*
* Example of Return Value:
* {
*     access_token: '12550510d6d74979a89ca2daf595616e',
*     expires_in: 7199,
*     client_id: '3f04c0dd-0c53-4b28-8502-4506b6d7148a',
*     token_type: 'BimPlus'
*   }
*/
const requestAutenticationToken = async (email, password, applicationId) => {
	const response = await axios({
		method: "POST",
		url: "https://api-stage.bimplus.net/v2/authorize",
		data: {
			user_id: email,
			password: password,
			application_id: applicationId,
		},
    });
    
	const data = {...response.data};
	//console.log('--------Bimplus Authorization Token:----------')
	//console.log(data);
	return data;
};


// const getTeamInfo = async (access_token) => {

//     const headers = {
//         Authorization: 'BimPlus ' + access_token
//     }
//     const response = await axios.get(
//         'https://api-stage.bimplus.net/v2/teams', {
//             headers
//         }
//     )
//     const data = response.data;
//     return data
// }

module.exports={requestAutenticationToken};