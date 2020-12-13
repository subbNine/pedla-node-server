const BaseController = require("./base");
const { TruckDto } = require("../../entities/dtos");
const { truck: truckService } = require("../../services");

module.exports = class Truck extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async createTruck(req, res, next) {
		const { name, truckNo } = req.body;

		const { user } = req._App;

		const truckDto = new TruckDto();
		truckDto.owner = user.id;
		truckDto.name = name;
		truckDto.truckNo = truckNo;

		const result = await truckService.createTruck(truckDto);

		this.response(result, res);
	}

	async updateTruck(req, res, next) {
		const { name, truckNo } = req.body;
		const { truckId } = req.params;

		const truckDto = new TruckDto();
		truckDto.id = truckId;
		truckDto.name = name;
		truckDto.truckNo = truckNo;

		const result = await truckService.updateTruck(truckDto);

		this.response(result, res);
	}

	async createTrucks(req, res, next) {
		const { trucks } = req.body;
		const { user } = req._App;

		const truckDtoList = [];
		for (const truck of trucks) {
			const { name, truckNo } = truck;

			const truckDto = new TruckDto();
			truckDto.name = name;
			truckDto.truckNo = truckNo;
			truckDto.owner = user.id;

			truckDtoList.push(peddlerTruckDto);
		}

		const result = await truckService.createTrucks(truckDtoList);

		this.response(result, res);
	}

	async getPeddlerTrucks(req, res, next) {
		const { peddlerId } = req.params;

		const truckDto = new TruckDto();

		const { user } = req._App;

		truckDto.owner = peddlerId || user.id;

		const result = await truckService.findTrucks(truckDto);

		this.response(result, res);
	}
};
