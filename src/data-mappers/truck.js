const BaseMapper = require("./base");
const { TruckEnt } = require("../entities/domain");

module.exports = class UserMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findTrucks(filter) {
		const { Truck } = this.models;
		const docs = await Truck.find(this._toPersistence(filter));
		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(
					this._toEntity(doc.toObject(), TruckEnt, { _id: "id" })
				);
			}

			return results;
		}
	}

	async findTruck(filter) {
		const { Truck } = this.models;
		const doc = await Truck.findOne(this._toPersistence(filter));

		if (doc) {
			return this._toEntity(doc.toObject(), TruckEnt, { _id: "id" });
		}
	}

	async createTruck(productEnt) {
		const { Truck } = this.models;

		const newTruck = this._toPersistence(productEnt);

		const doc = await Truck.create(newTruck);

		if (doc) {
			return this._toEntity(doc.toObject(), TruckEnt, { _id: "id" });
		}
	}

	async updateTruckById(id, productEnt) {
		const { Truck } = this.models;

		const updates = this._toPersistence(productEnt);

		const doc = await Truck.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this._toEntity(doc.toObject(), TruckEnt, { _id: "id" });
		}
	}

	async deleteTruck(id) {
		const { Truck } = this.models;

		const doc = await Truck.findByIdAndDelete(id);

		if (doc) {
			return this._toEntity(doc.toObject(), TruckEnt, { _id: "id" });
		}
	}
};
