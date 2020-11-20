const socketio = require("socket.io-client");
//singleton for socket object

class Socket {
	constructor(endpoint) {
		this.socket = socketio(endpoint, { transports: ["websocket", "polling", "flashsocket"] });
		console.log(this.socket);
	}
	get socketInstance() {
		return this.socket;
	}
}
class Singleton {
	constructor() {
		if (!Singleton.instance) {
			Singleton.instance = new Socket(process.env.TRACKING_SOCKET_SERVER_ENDPOINT);
		}
	}
	getInstance() {
		console.log("--------------");
		console.log(Singleton.instance);
		if (Singleton.instance) {
			return Singleton.instance.socketInstance;
		}
		return Singleton.instance;
	}
}

module.exports = Singleton;
