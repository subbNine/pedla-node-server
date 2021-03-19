const { error } = require("../../errors");

module.exports = function enforceOneDriverToOneTruck(truckAssignedADriver) {
	const services = require("../../services");

	const truckService = services.truck;
	const userService = services.user;

	truckService
		.detachDriverFromOtherTrucksButOne(truckAssignedADriver)
		.catch((err) => error(err));

	userService
		.detachTruckFromOtherDriversButOne(truckAssignedADriver)
		.catch((err) => error(err));
};
