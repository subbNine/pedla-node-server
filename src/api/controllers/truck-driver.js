const BaseController = require("./base");
const { TruckDriverDto } = require("../../entities/dtos");
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
};
