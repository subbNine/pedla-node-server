const { Types } = require("mongoose");

const BaseMapper = require("./base");
const {
	TruckEnt,
	UserEnt,
	PeddlerProductEnt,
	ProductEnt,
} = require("../entities/domain");
const isType = require("../lib/utils/is-type");

module.exports = class TruckMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findTrucks(filter) {
		const { Truck } = this.models;
		const q = Truck.find(this.toTruckPersistence(filter))
			.populate("ownerId")
			.populate({ path: "productId", populate: { path: "productId" } });

		q.where({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

		const docs = await q;
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
		const q = Truck.findOne(this.toTruckPersistence(filter))
			.populate("ownerId")
			.populate({ path: "productId", populate: { path: "productId" } });

		q.where({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

		const doc = await q;

		if (doc) {
			const docObj = doc.toObject();
			return this.toTruckEnt(docObj);
		}
	}

	async createTruck(truckEnt) {
		const { Truck } = this.models;

		const newTruck = this.toTruckPersistence(truckEnt);

		const doc = await Truck.create(newTruck);

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		} else {
			return this.toTruckEnt({});
		}
	}

	async updateTruckById(id, truckEnt) {
		const { Truck } = this.models;

		const updates = this.toTruckPersistence(truckEnt);

		const doc = await Truck.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		} else {
			return this.toTruckEnt({});
		}
	}

	async deleteTruck(id) {
		const { Truck } = this.models;

		const doc = await Truck.findByIdAndUpdate(id, { isDeleted: true });

		if (doc) {
			const docObj = doc.toObject();
			return this.toTruckEnt(docObj);
		} else {
			return this.toTruckEnt({});
		}
	}

	toTruckEnt(doc) {
		if (doc) {
			let userEnt;
			let peddlerProductEnt;
			if (
				doc.ownerId &&
				!Types.ObjectId.isValid(doc.ownerId) &&
				doc.ownerId._id
			) {
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

			if (
				doc.productId &&
				!Types.ObjectId.isValid(doc.productId) &&
				doc.productId._id
			) {
				const entObj = doc.productId;

				peddlerProductEnt = this._toEntity(entObj, PeddlerProductEnt, {
					_id: "id",
				});

				if (
					entObj.productId &&
					!Types.ObjectId.isValid(entObj.productId) &&
					entObj.productId._id
				) {
					const productEnt = this._toEntity(entObj.productId, ProductEnt, {
						_id: "id",
					});

					peddlerProductEnt.product = productEnt;
				}
			} else {
				peddlerProductEnt = this._toEntity(
					{ id: doc.productId },
					PeddlerProductEnt,
					{
						_id: "id",
					}
				);
			}

			const entObj = {
				...doc,
				owner: userEnt,
				product: peddlerProductEnt,
			};

			const truckEnt = this._toEntity(entObj, TruckEnt, {
				_id: "id",
				ownerId: "owner",
				productId: "product",
			});

			return truckEnt;
		}
	}

	toTruckPersistence(ent) {
		if (ent.product) {
			if (ent.product.id) {
				ent.product = ent.product.id;
			} else {
				ent.product = typeof ent.product === "object" ? undefined : ent.product;
			}
		}

		if (ent.owner) {
			if (ent.owner.id) {
				ent.owner = ent.owner.id;
			} else {
				ent.owner = typeof ent.owner === "object" ? undefined : ent.owner;
			}
		}

		return this._toPersistence(ent, {
			product: "productId",
			owner: "ownerId",
		});
	}
};
