const { utils, error } = require("../lib");
const { TruckAndDriverEnt, TruckEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class TruckAndDriver {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async _findOwnTrucks(owner) {
		const { truckMapper } = this.mappers;

		const truckEnt = new TruckEnt({ owner });

		const myTrucks = await truckMapper.findTrucks(truckEnt);

		if (myTrucks) {
			return myTrucks.map((each) => each.id.toString());
		}
	}

	async _findOwnDrivers(owner) {
		const { userMapper } = this.mappers;

		const myDrivers = await userMapper.findUsers({ peddler: owner.id });

		if (myDrivers) {
			return myDrivers.map((each) => each.id.toString());
		}
	}

	async _checkOwnerOf(truckAndDriverDto, owner) {
		const ownTrucksPromise = this._findOwnTrucks(owner);

		const ownDriversPromise = this._findOwnDrivers(owner);

		const [ownTruckIds, ownDriverIds] = await Promise.all([
			ownTrucksPromise,
			ownDriversPromise,
		]);

		const driverIdFromInput = truckAndDriverDto.driver.id;
		const trukIdFromInput = truckAndDriverDto.truck.id;

		if (!ownTruckIds || !ownTruckIds.includes(trukIdFromInput)) {
			return Result.fail(
				new AppError({
					name: errorCodes.WrongAssignment.name,
					message: errMessages.wrongTruckAssignment,
					statusCode: errorCodes.WrongAssignment.statusCode,
				})
			);
		}

		if (!ownDriverIds || !ownDriverIds.includes(driverIdFromInput)) {
			return Result.fail(
				new AppError({
					name: errorCodes.WrongAssignment.name,
					message: errMessages.wrongDriverAssignment,
					statusCode: errorCodes.WrongAssignment.statusCode,
				})
			);
		}

		return Result.ok(true);
	}

	async assignTruckToDriver(truckAndDriverDto, owner) {
		const { truckAndDriverMapper } = this.mappers;

		const isConfirmedOwnershipOnTruckAndDriver = await this._checkOwnerOf(
			truckAndDriverDto,
			owner
		);

		if (isConfirmedOwnershipOnTruckAndDriver.isFailure) {
			return isConfirmedOwnershipOnTruckAndDriver;
		}

		const truckAssignedADriverPromise = truckAndDriverMapper.findTruckAndDriver(
			{
				truckId: truckAndDriverDto.truck.id,
			}
		);

		const driverAssignedATruckPromise = truckAndDriverMapper.findTruckAndDriver(
			{
				driverId: truckAndDriverDto.driver.id,
			}
		);

		const [truckAssignedADriver, driverAssignedATruck] = await Promise.all([
			truckAssignedADriverPromise,
			driverAssignedATruckPromise,
		]);

		if (truckAssignedADriver && driverAssignedATruck) {
			if (
				truckAssignedADriver.id.toString() ===
				driverAssignedATruck.id.toString()
			) {
				return Result.ok(driverAssignedATruck);
			}
		}

		if (truckAssignedADriver) {
			await truckAndDriverMapper.deleteTruckAndDriver({
				_id: truckAssignedADriver.id,
			});
		}

		if (driverAssignedATruck) {
			const newTruckAndDriver = await truckAndDriverMapper.updateTruckAndDriver(
				{ driverId: truckAndDriverDto.driver.id },
				new TruckAndDriverEnt(truckAndDriverDto)
			);

			return Result.ok(newTruckAndDriver.toDto());
		} else {
			const newTruckAndDriver = await truckAndDriverMapper.createTruckAndDriver(
				new TruckAndDriverEnt(truckAndDriverDto)
			);

			return Result.ok(newTruckAndDriver.toDto());
		}
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
				return Result.ok(truckAndDrivers.map((each) => each && each.toDto()));
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

		return Result.ok(updatedTruckAndDriver.toDto());
	}
};
