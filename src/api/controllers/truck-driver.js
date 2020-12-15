const BaseController = require("./base");
const { TruckAndDriverDto, UserDto } = require("../../entities/dtos");
const { truckAndDriver: truckAndDriverService } = require("../../services");

module.exports = class Truck extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async assignTruckToDriver(req, res, next) {
		const { truckId, driverId } = req.body;
		const { user } = req._App;

		const truckAndDriverDto = new TruckAndDriverDto();

		truckAndDriverDto.truck.id = truckId;
		truckAndDriverDto.driver.id = driverId;

		const result = await truckAndDriverService.assignTruckToDriver(
			truckAndDriverDto,
			user
		);

		this.response(result, res);
	}

	async getTruckAndDrivers(req, res, next) {
		const { user } = req._App;

		const truckOwnerDto = new UserDto();
		truckOwnerDto.id = user.id;

		const result = await truckAndDriverService.findTruckAndDrivers(
			truckOwnerDto
		);

		this.response(result, res);
	}

	async updateTruckAndDriver(req, res, next) {
		const { truckId, driverId } = req.body;
		const { truckDriverId } = req.params;

		const truckAndDriverDto = new TruckAndDriverDto();
		truckAndDriverDto.id = truckDriverId;
		truckAndDriverDto.truck.id = truckId;
		truckAndDriverDto.driver.id = driverId;

		const result = await truckAndDriverService.updateTruckAndDriver(
			truckAndDriverDto
		);

		this.response(result, res);
	}
};
