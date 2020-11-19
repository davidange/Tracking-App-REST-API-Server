const socketIo = require("./socketIo");
const io = new socketIo();

/**
 * Emits to all the subscribed Clients to the projectId the new Location of the entity identified with id
 * @param {String} projectId
 * @param {String} id
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
const entityLocationChanged = (projectId, id, x, y, z) => {
	io.to(projectId).emit(id, { location: { x, y, z } });
};

module.export = {
	entityLocationChanged,
};
