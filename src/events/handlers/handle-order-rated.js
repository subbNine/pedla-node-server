const { error } = require("../../errors");

module.exports = function handleOrderRated(order) {
	const services = require("../../services");

	const userService = services.user;

	userService.rateDriver(order).catch((err) => error(err));
};
