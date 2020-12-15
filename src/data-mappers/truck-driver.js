const BaseMapper = require("./base");
const { TruckDriverEnt, TruckEnt, UserEnt } = require("../entities/domain");

module.exports = class TruckDriverMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findTruckDrivers(filter) {
		const { TruckDriver } = this.models;
		const docs = await TruckDriver.find(filter)
			.populate("truckId")
			.populate("driverId");

		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(this.toTruckDriverEnt(doc.toObject()));
			}

			return results;
		}
	}

	async findTruckDriver(filter) {
		const { TruckDriver } = this.models;
		const doc = await TruckDriver.findOne(filter)
			.sort("-createdAt")
			.populate("truckId")
			.populate("driverId");

		if (doc) {
			return this.toTruckDriverEnt(doc.toObject());
		}
	}

	async createTruckDriver(truckDriverEnt) {
		const { TruckDriver } = this.models;

		const newTruckDriver = this.toTruckDriverPersistence(truckDriverEnt);

		const doc = await TruckDriver.create(newTruckDriver);

		if (doc) {
			return this.toTruckDriverEnt(doc.toObject());
		}
	}

	async updateTruckDriverById(id, truckDriverEnt) {
		const { TruckDriver } = this.models;

		const updates = this.toTruckDriverPersistence(truckDriverEnt);

		const doc = await TruckDriver.findByIdAndUpdate(id, updates, {
			new: true,
		});

		if (doc) {
			return this.toTruckDriverEnt(doc.toObject());
		}
	}

	async deleteTruckDriver(id) {
		const { TruckDriver } = this.models;

		const doc = await TruckDriver.findByIdAndDelete(id);

		if (doc) {
			return this.toTruckDriverEnt(doc.toObject());
		}
	}

	toTruckDriverEnt(doc) {
		if (doc) {
			let truckEnt;
			let driverEnt;
			if (doc.truckId && doc.truckId._id) {
				// doc.truckId is an object. This indicates that it has been populated
				truckEnt = this._toEntity(doc.truckId, TruckEnt, {
					_id: "id",
					ownerId: "owner",
					productId: "product",
				});
			} else {
				truckEnt = this._toEntity({ id: doc.truckId }, TruckEnt, {
					_id: "id",
					ownerId: "owner",
					productId: "product",
				});
			}

			if (doc.driverId && doc.driverId._id) {
				driverEnt = this._toEntity(doc.driverId, UserEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				driverEnt = this._toEntity({ id: doc.driverId }, UserEnt, {
					_id: "id",
					streetAddress: "address",
				});
			}

			doc.truckId = truckEnt;
			doc.driverId = driverEnt;

			const truckDriverEnt = this._toEntity(doc, TruckDriverEnt, {
				_id: "id",
				truckId: "truck",
				driverId: "driver",
			});

			return truckDriverEnt;
		}
	}

	toTruckDriverPersistence(ent) {
		if (ent.truck) {
			if (ent.truck.id) {
				ent.truck = ent.truck.id;
			} else {
				ent.truck =
					typeof ent.truck === "object" ? undefined : ent.truck;
			}
		}

		if (ent.driver) {
			if (ent.driver.id) {
				ent.driver = ent.driver.id;
			} else {
				ent.driver =
					typeof ent.driver === "object" ? undefined : ent.driver;
			}
		}

		return this._toPersistence(ent, {
			driver: "driverId",
			truck: "truckId",
		});
	}
};
