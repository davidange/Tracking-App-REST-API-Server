<hr/>

# Socket.IO Server
This Server (The REST API server) has constant communication to the Socket.IO Server.
This server emits all the changes of locations of the entities that occur. The Clients can create a socket and listen to those changes by subscribing to the Socket.io Server, located in this link <https://tracking-bimplus-beacon-socket.herokuapp.com/>.
The documentation for all the available events and listeners that the client can subscribe to are located in the gitlab Repository found here: <https://gitlab.lrz.de/software-lab-2020/tracking-app-socket-server>