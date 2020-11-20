const socketIO = require("./socket");

/**
 * Emits to all the subscribed Clients to the projectId the new Location of the entity identified with id
 * @param {String} projectId
 * @param {String} entityId
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */

const emitEntityNewLocation = (projectId, entityId, x, y, z) => {
	const socket = new socketIO().getInstance();
	socket.emit(`update-location`, projectId, entityId, { x, y, z });
	return;
};

module.exports = {
	emitEntityNewLocation,
};
