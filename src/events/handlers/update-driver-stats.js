const { error } = require("../../errors");

module.exports = function updateDriverStats(order, stats) {
	const services = require("../../services");

	const userService = services.user;

	userService.updateDriverOrderStats(order, stats).catch((err) => error(err));
};
