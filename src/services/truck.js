const { utils, error } = require("../lib");
const { TruckEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class Truck {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async createTrucks(truckDtoList) {
		let resultList;
		const arrOfPromises = [];
		for (const truckDto of truckDtoList) {
			arrOfPromises.push(this.createTruck(truckDto));
		}
		resultList = await Promise.all(arrOfPromises);

		return Result.ok(resultList.map((eachTruck) => eachTruck.repr()));
	}

	async createTruck(truckDto) {
		const { truckMapper } = this.mappers;

		const foundTruck = await truckMapper.findTruck({
			name: truckDto.product,
			owner: truckDto.owner,
		});

		console.log({ truckDto, foundTruck });

		if (foundTruck) {
			return Result.fail(
				new AppError({
					name: errorCodes.NameConflictError.name,
					message: errMessages.nameConflict,
					statusCode: errorCodes.NameConflictError.statusCode,
				})
			);
		} else {
			const newTruck = await truckMapper.createTruck(
				new TruckEnt(truckDto)
			);
			return Result.ok(newTruck.repr());
		}
	}

	async findTrucks(truckDto) {
		const { truckMapper } = this.mappers;

		const foundTrucks = await truckMapper.findTrucks(
			new TruckEnt(truckDto)
		);

		if (foundTrucks) {
			return Result.ok(foundTrucks.map((eachTruck) => eachTruck.repr()));
		} else {
			return Result.ok([]);
		}
	}

	async updateTruck(truckDto) {
		const { truckMapper } = this.mappers;
		const truckEnt = new TruckEnt(truckDto);

		const updatedTruck = await truckMapper.updateTruckById(
			truckEnt.id,
			truckEnt
		);

		return Result.ok(updatedTruck.repr());
	}
};
