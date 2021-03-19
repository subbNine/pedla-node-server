const { error } = require("../../errors");

module.exports = function attachTruckToDriver(truck) {
	const services = require("../../services");

	const userService = services.user;

	userService.attachTruckToDriver(truck).catch((err) => error(err));
};
