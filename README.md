# Tracking App REST API Server 
This is a Stateless server that manages and sets up the project for Location inside a BIMPlus Model. It also estimates the location of the user based on weighted trilateration. This Server comunicates through a socket with a Socket Server for emiting all the location changes of the tracked entities, therefore allowing real time update of the user locations.

To see all the available endpoints of this server, run the following npm command to build the api documentation.
```
npm run build
```
The documentation will be located inside the created *doc* folder.
This documentation is also accessible once the server is running, in the route /api-docs/