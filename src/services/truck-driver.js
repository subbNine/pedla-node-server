const { utils, error } = require("../lib");
const { TruckDriverEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class TruckDriver {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async assignTruckToDriver(truckDriverDto) {
		const { truckDriverMapper } = this.mappers;

		const foundTruckDriver = await truckDriverMapper.findTruckDriver({
			truck: truckDriverDto.truck,
		});

		if (foundTruckDriver) {
			if (foundTruckDriver.hasBeenAssignedTruck(truckDriverDto)) {
				return Result.fail(
					new AppError({
						name: errorCodes.NameConflictError.name,
						message: errMessages.truckDriverConflict,
						statusCode: errorCodes.NameConflictError.statusCode,
					})
				);
			}
		}

		const newTruckDriver = await truckDriverMapper.createTruckDriver(
			new TruckDriverEnt(truckDriverDto)
		);
		return Result.ok(newTruckDriver.repr());
	}

	async findTruckDrivers(truckOwnerDto) {
		const { truckMapper, truckDriverMapper } = this.mappers;

		const ownersTrucks = await truckMapper.findTrucks(truckOwnerDto);

		if (ownersTrucks) {
			let truckDriverQueryList = [];

			for (const truckEnt of truckEntList) {
				const query = truckDriverMapper.findTruck({ truck: truckEnt });
				truckDriverQueryList.push(query);
			}

			const results = await Promise.all(truckDriverQueryList);

			if (results && results.length) {
				return Result.ok(results.map((each) => each.repr()));
			}
		} else {
			return Result.ok([]);
		}
	}
};
