const { error } = require("../../errors");

module.exports = function handleTruckDeleted(truck) {
	const services = require("../../services");

	const userService = services.user;

	userService.detachTruckFromDriver(truck).catch((err) => error(err));
};
