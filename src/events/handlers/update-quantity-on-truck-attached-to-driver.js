const { error } = require("../../errors");

module.exports = function updateQuantityOfTruckAttachedToDriver(truck) {
	const services = require("../../services");

	const userService = services.user;

	userService
		.updateProductQuantityOnTruckAttachedToDriver(truck)
		.catch((err) => error(err));
};
