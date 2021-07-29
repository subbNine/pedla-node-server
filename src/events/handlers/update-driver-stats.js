const { error } = require("../../errors");

module.exports = function updateDriverStats(order, stats) {
	const services = require("../../services");

	const userService = services.user;

	userService.updateDriverOrderStats(order.driver, stats).catch((err) => error(err));
};
