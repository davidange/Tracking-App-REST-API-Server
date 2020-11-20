const socketio = require("socket.io");

class Io {
	constructor(server) {
		this.server = socketio().listen(server);
		//set up connection to the project Room
		this.server.on("connection", (socket) => {
			console.log("Someone is trying to connect....");
			socket.on("join", ({ projectId }) => {
				socket.join(projectId);
				console.log("Client is connected to Project Room");
			});
		});
	}
	get io() {
		return this.server;
	}
}
class Singleton {
	constructor(server) {
		if (server && !Singleton.instance) {
			Singleton.instance = new Io(server);
		}
	}
	getInstance() {
		if (Singleton.instance) {
			return Singleton.instance.io;
		}
		return Singleton.instance;
	}
}

module.exports = Singleton;
