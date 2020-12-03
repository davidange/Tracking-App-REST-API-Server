const socketio = require("socket.io-client");
/**Singleton representing the socket object connected to the socket web server.
*/
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
		if (Singleton.instance) {
			return Singleton.instance.socketInstance;
		}
		return Singleton.instance;
	}
}

module.exports = Singleton;
