const jwt =require( "jsonwebtoken");

module.exports = (req, res, next)=> {
	
	const token = req.get("Authorization");
	//if no token header
	if(!token){
		const error=new Error('Not Authenticated');
		error.statusCode=401;
		throw error;
	}
	//if token header
	let decodedToken;
	try {
		 decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
	} catch (err) {
		err.statusCode = 500;
		throw error;
	}
	if(!decodedToken){
		const error=new Error('Not Authenticated');
		error.statusCode=401;
		throw error;
	}
	//if authenticated
	req.user=decodedToken;
	next();
}


