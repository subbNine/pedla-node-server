const BaseController = require("./base");
const { TruckAndDriverDto, UserDto } = require("../../entities/dtos");
const {
	truckAndDriver: truckAndDriverService,
	truck: truckServices,
} = require("../../services");

module.exports = class Truck extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async assignTruckToDriver(req, res, next) {
		const { truckId, driverId } = req.body;
		const { user } = req._App;

		const result = await truckServices.assignTruckToDriver(
			{ truckId, driverId },
			user
		);

		this.response(result, res);
	}

	async getPeddlerTruckDrivers(req, res, next) {
		const { user } = req._App;

		const truckOwnerDto = new UserDto();
		truckOwnerDto.id = user.id;

		const result = await truckServices.getTruckDrivers(truckOwnerDto);

		this.response(result, res);
	}

	async updateTruckDriver(req, res, next) {
		const { truckId, driverId } = req.body;
		const { user } = req._App;

		const result = await truckServices.assignTruckToDriver(
			{ truckId, driverId },
			user
		);

		this.response(result, res);
	}
};
