<hr/>

# Sockets

This is also a server that creates socket that emits the changes related to the location of the tracked entities, therefore the Client can get the location updates on real time. The sockets are implemented with **Socket.IO** . Refer to their [documentation](http://socket.io) for better knowledge on how Sockets are implemented. 

For the client to initiate the connection to the server and create a socket, it must directly connect to this server URL with the **socket.io-client** API. More information can be found in this [link](https://socket.io/docs/v3/client-api/).

### Listeners
The Listeners that the server handles as of right now are the following:

#### join
Indicates that the client is joining the room identified by *projectId* and listening to its events.
##### Parameters
| Field | Type       | Description |
|-------|------------|-------------|
| projectId | String    | project that the Client will be subscribed to.|

##### Example of Client emiit:
```javascript
import io from ('socket.io');
// creates a client socket that is connected to SERVER_URL
let socket = io(SERVER_URL);
//emits the join event  and indicates that the client is joining the room projectId
socket.emit('join',projectId);
```


### Events
The Events that the server emits as of right now are the following:

#### entity-new-location-`id`
Once the client has connected to the server and joined a room (representing a project), it can listen to the changes of the tracked entities , identified by `id`.

##### Parameter
| Field | Type       | Description |
|-------|------------|-------------|
| id | String    | id of the entity that client wants to track.|

##### Output
JSON object with the following properties:
| Field | Type       | Description |
|-------|------------|-------------|
| location | JSON    | Coordinates of location of Item. {x,y,z}|

##### Example of Setting up Client Listeners for Event:
```javascript
//adds a listener for changes of entity.
socket.on(`entity-new-location-${id}`, ({location}) => {
   // callback function Here....
});
```