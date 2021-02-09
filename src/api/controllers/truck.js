const BaseController = require("./base");
const { TruckDto } = require("../../entities/dtos");
const { truck: truckService } = require("../../services");

module.exports = class Truck extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async createTruck(req, res, next) {
		const { model, brand, productId, size, quantity } = req.body;

		const { user } = req._App;

		const truckDto = new TruckDto();
		truckDto.owner.id = user.id;
		truckDto.product.id = productId;
		truckDto.model = model;
		truckDto.brand = brand;
		truckDto.size = size;
		truckDto.quantity = quantity;

		if (req.files) {
			const licenseImageObj = req.files["license"] && req.files["license"][0];
			const insuranceImageObj =
				req.files["insurance"] && req.files["insurance"][0];
			const worthinessImageObj =
				req.files["worthiness"] && req.files["worthiness"][0];
			const ownershipImageObj =
				req.files["ownership"] && req.files["ownership"][0];

			if (licenseImageObj)
				truckDto.license = {
					imgId: licenseImageObj.public_id,
					uri: licenseImageObj.secure_url,
				};

			if (insuranceImageObj)
				truckDto.insurance = {
					imgId: insuranceImageObj.public_id,
					uri: insuranceImageObj.secure_url,
				};

			if (worthinessImageObj)
				truckDto.worthiness = {
					imgId: worthinessImageObj.public_id,
					uri: worthinessImageObj.secure_url,
				};

			if (ownershipImageObj)
				truckDto.ownership = {
					imgId: ownershipImageObj.public_id,
					uri: ownershipImageObj.secure_url,
				};
		}

		const result = await truckService.createTruck(truckDto);

		this.response(result, res);
	}

	async updateTruck(req, res, next) {
		const { model, brand, productId, size, quantity } = req.body;
		const { truckId } = req.params;

		const truckDto = new TruckDto();
		truckDto.id = truckId;
		truckDto.product.id = productId;
		truckDto.model = model;
		truckDto.brand = brand;
		truckDto.size = size;
		truckDto.quantity = quantity;

		if (req.files) {
			const licenseImageObj = req.files["license"] && req.files["license"][0];
			const insuranceImageObj =
				req.files["insurance"] && req.files["insurance"][0];
			const worthinessImageObj =
				req.files["worthiness"] && req.files["worthiness"][0];
			const ownershipImageObj =
				req.files["ownership"] && req.files["ownership"][0];

			if (licenseImageObj)
				truckDto.license = {
					imgId: licenseImageObj.public_id,
					uri: licenseImageObj.secure_url,
				};

			if (insuranceImageObj)
				truckDto.insurance = {
					imgId: insuranceImageObj.public_id,
					uri: insuranceImageObj.secure_url,
				};

			if (worthinessImageObj)
				truckDto.worthiness = {
					imgId: worthinessImageObj.public_id,
					uri: worthinessImageObj.secure_url,
				};

			if (ownershipImageObj)
				truckDto.ownership = {
					imgId: ownershipImageObj.public_id,
					uri: ownershipImageObj.secure_url,
				};
		}

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

		truckDto.owner.id = peddlerId || user.id;

		const result = await truckService.findTrucks(truckDto);

		this.response(result, res);
	}
};
