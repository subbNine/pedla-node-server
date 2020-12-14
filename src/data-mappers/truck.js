const BaseMapper = require("./base");
const { TruckEnt, UserEnt, ProductEnt } = require("../entities/domain");

module.exports = class UserMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findTrucks(filter) {
		const { Truck } = this.models;
		const docs = await Truck.find(this.toTruckPersistence(filter))
			.populate("ownerId")
			.populate("productId");

		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(this.toTruckEnt(doc.toObject()));
			}

			return results;
		}
	}

	async findTruck(filter) {
		const { Truck } = this.models;
		const doc = await Truck.findOne(this.toTruckPersistence(filter))
			.populate("ownerId")
			.populate("productId");

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	async createTruck(productEnt) {
		const { Truck } = this.models;

		const newTruck = this.toTruckPersistence(productEnt);

		const doc = await Truck.create(newTruck);

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	async updateTruckById(id, productEnt) {
		const { Truck } = this.models;

		const updates = this.toTruckPersistence(productEnt);

		const doc = await Truck.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	async deleteTruck(id) {
		const { Truck } = this.models;

		const doc = await Truck.findByIdAndDelete(id);

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	toTruckEnt(doc) {
		if (doc) {
			let userEnt;
			let productEnt;
			if (doc.ownerId && doc.ownerId._id) {
				userEnt = this._toEntity(doc.ownerId, UserEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				userEnt = this._toEntity({ id: doc.ownerId }, UserEnt, {
					_id: "id",
					streetAddress: "address",
				});
			}

			if (doc.productId && doc.productId._id) {
				productEnt = this._toEntity(doc.productId, ProductEnt, {
					_id: "id",
				});
			} else {
				productEnt = this._toEntity({ id: doc.productId }, ProductEnt, {
					_id: "id",
				});
			}

			const truckEnt = this._toEntity(
				{ ...doc, owner: userEnt, product: productEnt },
				TruckEnt,
				{
					_id: "id",
					ownerId: "owner",
					productId: "product",
				}
			);

			return truckEnt;
		}
	}

	toTruckPersistence(ent) {
		if (ent.product) {
			if (ent.product.id) {
				ent.product = ent.product.id;
			} else {
				ent.product = undefined;
			}
		}

		if (ent.owner) {
			if (ent.owner.id) {
				ent.owner = ent.owner.id;
			} else {
				ent.owner = undefined;
			}
		}

		return this._toPersistence(ent, {
			product: "productId",
			owner: "ownerId",
		});
	}
};
