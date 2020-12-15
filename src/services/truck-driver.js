const { utils, error } = require("../lib");
const { TruckAndDriverEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class TruckAndDriver {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async assignTruckToDriver(truckAndDriverDto) {
		const { truckAndDriverMapper } = this.mappers;

		const foundTruckAndDriver = await truckAndDriverMapper.findTruckAndDriver({
			truckId: truckAndDriverDto.truck.id,
			driverId: truckAndDriverDto.driver.id,
		});

		if (foundTruckAndDriver) {
			if (foundTruckAndDriver.hasBeenAssignedTruck(truckAndDriverDto)) {
				return Result.fail(
					new AppError({
						name: errorCodes.DupplicateAssignmentError.name,
						message: errMessages.truckAndDriverConflict,
						statusCode:
							errorCodes.DupplicateAssignmentError.statusCode,
					})
				);
			}
		}

		const newTruckAndDriver = await truckAndDriverMapper.createTruckAndDriver(
			new TruckAndDriverEnt(truckAndDriverDto)
		);
		return Result.ok(newTruckAndDriver.repr());
	}

	async findTruckAndDrivers(truckOwnerDto) {
		const { truckMapper, truckAndDriverMapper } = this.mappers;

		const ownersTrucks = await truckMapper.findTrucks({
			owner: truckOwnerDto,
		});

		let truckIds;

		if (ownersTrucks) {
			truckIds = ownersTrucks.map((each) => each.id);
		}

		if (truckIds) {
			const truckAndDrivers = await truckAndDriverMapper.findTruckAndDrivers({
				truckId: { $in: truckIds },
			});

			if (truckAndDrivers && truckAndDrivers.length) {
				return Result.ok(
					truckAndDrivers.map((each) => each && each.repr())
				);
			} else {
				return Result.ok([]);
			}
		} else {
			return Result.ok([]);
		}
	}

	async updateTruckAndDriver(truckAndDriverDto) {
		const { truckAndDriverMapper } = this.mappers;
		const truckAndDriverEnt = new TruckAndDriverEnt(truckAndDriverDto);

		const updatedTruckAndDriver = await truckAndDriverMapper.updateTruckAndDriverById(
			truckAndDriverEnt.id,
			truckAndDriverEnt
		);

		return Result.ok(updatedTruckAndDriver.repr());
	}
};
