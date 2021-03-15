const { error } = require("../../errors");

module.exports = function subtractOrderedQuantityFromTruck(order) {
	const services = require("../../services");

	const orderService = services.orderService;

	orderService
		.subtractOrderedQuantityFromTruck(order)
		.catch((err) => error(err));
};
