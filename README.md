# Tracking App REST API Server 
This is a Stateless server that manages and sets up the project for Location inside a BIMPlus Model. It also estimates the location of the user based on weighted trilateration. This Server comunicates through a socket with a Socket Server for emiting all the location changes of the tracked entities, therefore allowing real time update of the user locations.


## Environment Variables
The environment Variables required for this application to run are the following:

Environment Variable | Description 
--- | --- 
`DB_DEVELOPMENT` | URI of the MongoDB database.  
`TOKEN_SECRET` | Secret for crypting and decrypting passwords for this server
`BIMPLUS_USER`| Bimplus user for accessing API
`BIMPLUS_PASSWORD`| Password of bimplus account
`BIMPLUS_APPLICATION_ID`| Application ID for accessing Bimplus API
`TRACKING_SOCKET_SERVER_ENDPOINT`| URL of Websocket Server (for enabling real time updates)

*Note:
Set them up inside a .env file at the root location if the server will be run locally.*
## Installation
This is a Node.js server. The packages and dependencies required for this server are located inside the package.json file. To install all the packages and dependencies needed to run this server simply run the following command:
```
npm install
```

## Quick Start (local Server)
The quickest way to get started once the *.env* file with the environment variables has been set is shown below:

Install the dependencies
```
npm install
```
Build the API documentation:
```
npm run build
```
Start server:
```
npm run start
```
View the server documentation at: http://localhost:3000/apidocs/


## REST API Documentation
To see all the available endpoints of this server, run the following npm command to build the api documentation.
```
npm run build
```
The documentation will be located inside the created *doc* folder.
This documentation is also accessible once the server is running, in the route: `serverURL`/api-docs/
