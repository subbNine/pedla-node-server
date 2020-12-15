const BaseController = require("./base");
const { TruckDriverDto, UserDto } = require("../../entities/dtos");
const { truckDriver: truckDriverService } = require("../../services");

module.exports = class Truck extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async assignTruckToDriver(req, res, next) {
		const { truckId, driverId } = req.body;
		const truckDriverDto = new TruckDriverDto();

		truckDriverDto.truck.id = truckId;
		truckDriverDto.driver.id = driverId;

		const result = await truckDriverService.assignTruckToDriver(
			truckDriverDto
		);

		this.response(result, res);
	}

	async getTruckDrivers(req, res, next) {
		const { user } = req._App;

		const truckOwnerDto = new UserDto();
		truckOwnerDto.id = user.id;

		const result = await truckDriverService.findTruckDrivers(truckOwnerDto);

		this.response(result, res);
	}

	async updateTruckDriver(req, res, next) {
		const { truckId, driverId } = req.body;
		const { truckDriverId } = req.params;

		const truckDriverDto = new TruckDriverDto();
		truckDriverDto.id = truckDriverId;
		truckDriverDto.truck.id = truckId;
		truckDriverDto.driver.id = driverId;

		const result = await truckDriverService.updateTruckDriver(
			truckDriverDto
		);

		this.response(result, res);
	}
};
