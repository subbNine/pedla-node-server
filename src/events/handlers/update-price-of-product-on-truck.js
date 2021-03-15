const { error } = require("../../errors");

module.exports = function updatePriceOfProductOnTruck(
	newPrice,
	product,
	peddlerId
) {
	const services = require("../../services");

	const userService = services.user;
	const truckService = services.truck;

	userService
		.updateProductPriceOnTruckAttachedToDriver(newPrice, product, peddlerId)
		.catch((err) => error(err));

	truckService
		.updateProductPriceOnTruck(newPrice, product, peddlerId)
		.catch((err) => error(err));
};
