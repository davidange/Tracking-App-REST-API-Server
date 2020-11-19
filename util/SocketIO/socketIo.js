const socketio = require("socket.io");

class Io {
	constructor(app) {
		this.server = socketio(app.listen());

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
	constructor(app) {
		if (app && !Singleton.instance) {
			Singleton.instance = new Io(app);
		}
	}
	getInstance() {
		return Singleton.instance;
	}
}

module.exports = Singleton;
