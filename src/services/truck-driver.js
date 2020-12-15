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
			truckId: truckDriverDto.truck.id,
			driverId: truckDriverDto.driver.id,
		});

		if (foundTruckDriver) {
			if (foundTruckDriver.hasBeenAssignedTruck(truckDriverDto)) {
				return Result.fail(
					new AppError({
						name: errorCodes.DupplicateAssignmentError.name,
						message: errMessages.truckDriverConflict,
						statusCode:
							errorCodes.DupplicateAssignmentError.statusCode,
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

		const ownersTrucks = await truckMapper.findTrucks({
			owner: truckOwnerDto,
		});

		let truckIds;

		if (ownersTrucks) {
			truckIds = ownersTrucks.map((each) => each.id);
		}

		if (truckIds) {
			const truckDrivers = await truckDriverMapper.findTruckDrivers({
				truckId: { $in: truckIds },
			});

			if (truckDrivers && truckDrivers.length) {
				return Result.ok(
					truckDrivers.map((each) => each && each.repr())
				);
			} else {
				return Result.ok([]);
			}
		} else {
			return Result.ok([]);
		}
	}

	async updateTruckDriver(truckDriverDto) {
		const { truckDriverMapper } = this.mappers;
		const truckDriverEnt = new TruckDriverEnt(truckDriverDto);

		const updatedTruckDriver = await truckDriverMapper.updateTruckDriverById(
			truckDriverEnt.id,
			truckDriverEnt
		);

		return Result.ok(updatedTruckDriver.repr());
	}
};
