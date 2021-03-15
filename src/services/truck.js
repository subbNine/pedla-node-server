const { utils } = require("../lib");
const { TruckEnt } = require("../entities/domain");
const { eventEmitter, eventTypes } = require("../events");

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

		return Result.ok(resultList.map((eachTruck) => eachTruck.toDto()));
	}

	async createTruck(truckDto) {
		const { truckMapper } = this.mappers;

		await truckMapper.createTruck(new TruckEnt(truckDto));

		return Result.ok({ success: true });
	}

	async getTrucks(truckDto) {
		const { truckMapper } = this.mappers;

		const trucks = await truckMapper.findTrucks({ ownerId: truckDto.owner.id });

		return Result.ok(
			trucks ? trucks.map((eachTruck) => eachTruck.toDto()) : []
		);
	}

	async getTruckDrivers(owner) {
		const { truckMapper } = this.mappers;

		const trucks = await truckMapper.findTrucks({
			$and: [{ ownerId: owner.id }, { driverId: { $exists: true } }],
		});

		return Result.ok(
			trucks
				? trucks.map((eachTruck) => {
						const { driver, ...truckFields } = eachTruck.toDto();
						return { driver, truck: truckFields };
				  })
				: []
		);
	}

	async assignTruckToDriver(truckAndDriver, truckOwner) {
		const { truckMapper } = this.mappers;
		const { truckId, driverId } = truckAndDriver;

		const truckEnt = new TruckEnt({
			driver: driverId,
		});

		const updatedTruck = await truckMapper.updateTruckBy(
			{
				_id: truckId,
				ownerId: truckOwner.id,
			},
			truckEnt
		);

		if (updatedTruck) {
			eventEmitter.emit(eventTypes.truckAssignedToDriver, updatedTruck);
		}

		const { driver, ...truck } = updatedTruck.toDto();

		return Result.ok({ driver, truck });
	}

	async updateTruck(truckDto) {
		const { truckMapper } = this.mappers;
		const truckEnt = new TruckEnt(truckDto);

		const updatedTruck = await truckMapper.updateTruckById(
			truckEnt.id,
			truckEnt
		);

		if (updatedTruck && truckDto.quantity) {
			eventEmitter.emit(eventTypes.quantityOfTruckUpdated, updatedTruck);
		}

		return Result.ok(updatedTruck ? updatedTruck.toDto() : null);
	}

	async deleteTruck(truckId) {
		const { truckMapper } = this.mappers;

		const deletedTruck = await truckMapper.deleteTruck(truckId);

		if (deletedTruck) {
			eventEmitter.emit(eventTypes.truckDeleted, deletedTruck);
		}

		return Result.ok(deletedTruck ? deletedTruck.toDto() : null);
	}

	async detachDriverFromTruck(driver) {
		const { truckMapper } = this.mappers;

		await truckMapper.detachDriver(driver);

		return Result.ok(true);
	}

	async detachDriverFromOtherTrucksButOne(truckEnt) {
		const { truckMapper } = this.mappers;

		await truckMapper.detachDriverFromOtherTrucksButOne(truckEnt);

		return true;
	}

	async updateProductPriceOnTruck(newPrice, product, peddlerId) {
		const { truckMapper } = this.mappers;

		return await truckMapper.updateProductPriceOnTruck(
			newPrice,
			product,
			peddlerId
		);
	}
};
