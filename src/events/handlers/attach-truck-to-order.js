const { error } = require("../../errors");

module.exports = function attachTruckToOrder(order) {
	const services = require("../../services");

	const orderService = services.orderService;

	return orderService.attachTruckToOrder(order).catch((err) => error(err));
};
