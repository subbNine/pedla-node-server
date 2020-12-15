const { utils } = require("../lib");
const { TruckEnt } = require("../entities/domain");
const asyncExec = require("../lib/utils/async-exec");

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

		await truckMapper.createTruck(new TruckEnt(truckDto));

		return Result.ok({ success: true });
	}

	async findTrucks(truckDto) {
		const { truckMapper, truckAndDriverMapper } = this.mappers;

		const foundTrucks = await truckMapper.findTrucks(
			new TruckEnt(truckDto)
		);

		const trucksWithDrivers = await asyncExec(
			foundTrucks,
			async (truckEnt) => {
				const truckWithDriver = await truckAndDriverMapper.findTruckAndDriver(
					{
						truckId: truckEnt.id,
					}
				);

				if (truckWithDriver) {
					truckEnt.driver = truckWithDriver.driver.repr();
					return truckEnt;
				} else {
					return truckEnt;
				}
			}
		);

		if (trucksWithDrivers) {
			return Result.ok(
				trucksWithDrivers.map((eachTruck) => eachTruck.repr())
			);
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
