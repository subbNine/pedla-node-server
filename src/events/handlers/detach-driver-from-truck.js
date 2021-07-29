const { error } = require("../../errors");

module.exports = function detachDriverFromTruck(driver) {
	const services = require("../../services");

	const truckService = services.truck;

	truckService.detachDriverFromTruck(driver).catch((err) => error(err));
};
