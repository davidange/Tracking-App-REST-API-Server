const socketIo = require("./socketIo");

/**
 * Emits to all the subscribed Clients to the projectId the new Location of the entity identified with id
 * @param {String} projectId
 * @param {String} id
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */

const emitEntityNewLocation = (projectId, id, x, y, z) => {
	const io = new socketIo().getInstance();
	io.to(projectId).emit(`entity-new-location-${id}`, { location: { x, y, z } });
	console.log("emited new Location !!");
	console.log(x, y, z);
	return;
};

module.exports = {
	emitEntityNewLocation,
};
