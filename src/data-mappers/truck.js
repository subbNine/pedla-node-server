const BaseMapper = require("./base");
const {
	TruckEnt,
	ProductEnt,
	PeddlerEnt,
	DriverEnt,
	PeddlerProductEnt,
} = require("../entities/domain");
const { isObjectId, isType } = require("../lib/utils");

module.exports = class TruckMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findTrucks(filter) {
		const { Truck } = this.models;

		const q = Truck.find(filter)
			.populate("driverId")
			.populate("ownerId")
			.populate("productId");

		q.where({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

		const docs = await q;
		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(this.createTruckEntity(doc.toObject()));
			}

			return results;
		}
	}

	async findTruck(filter) {
		const { Truck } = this.models;
		const q = Truck.findOne(this.toTruckPersistence(filter))
			.populate("driverId")
			.populate("ownerId")
			.populate("productId");

		q.where({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] });

		const doc = await q;

		if (doc) {
			const docObj = doc.toObject();
			return this.createTruckEntity(docObj);
		}
	}

	async createTruck(truckEnt) {
		const { Truck } = this.models;

		const truck = this.toTruckPersistence(truckEnt);

		const doc = await Truck.create(truck);

		if (doc) {
			return this.createTruckEntity(doc.toObject());
		} else {
			return this.createTruckEntity({});
		}
	}

	async updateTruckBy(filter, truckEnt) {
		const { Truck } = this.models;

		const updates = this.toTruckPersistence(truckEnt);

		const doc = await Truck.findOneAndUpdate(filter, updates, { new: true });

		if (doc) {
			return this.createTruckEntity(doc.toObject());
		}
	}

	async updateTruckById(id, truckEnt) {
		const { Truck } = this.models;

		const updates = this.toTruckPersistence(truckEnt);

		const doc = await Truck.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this.createTruckEntity(doc.toObject());
		}
	}

	async updateOrderedQuantityInTruck(order) {
		const truckId = order.truckId;

		const updates = { $inc: { quantity: order.quantity } };

		return await this.updateTruckById(truckId, updates);
	}

	async detachDriver(driver) {
		const { Truck } = this.models;

		await Truck.updateMany(
			{ driverId: driver.id },
			{ $unset: { driverId: "" } }
		);

		return true;
	}

	async detachDriverFromOtherTrucksButOne(truckEnt) {
		const { Truck } = this.models;

		await Truck.updateMany(
			{
				$and: [{ _id: { $ne: truckEnt.id } }, { driverId: truckEnt.driver.id }],
			},
			{ $unset: { driverId: "" } }
		);

		return true;
	}

	async deleteTruck(id) {
		const { Truck } = this.models;

		const doc = await Truck.findByIdAndUpdate(id, {
			isDeleted: true,
			$unset: { driverId: "" },
		});

		if (doc) {
			const docObj = doc.toObject();
			return this.createTruckEntity(docObj);
		}
	}

	async updateProductPriceOnTruck(newPrice, product, peddlerId) {
		const { Truck } = this.models;

		const updates = {};

		if (newPrice) {
			for (key in newPrice) {
				updates["productPrice." + key] = newPrice[key];
			}
		}

		return await Truck.updateMany(
			{
				$and: [{ ownerId: peddlerId }, { productId: product.id }],
			},
			{ $set: { ...updates } }
		);
	}

	createTruckEntity(doc) {
		if (doc) {
			let truckOwnerEnt;
			let driverEnt;
			let productEnt;
			if (isType("object", doc.ownerId) && !isObjectId(doc.ownerId)) {
				truckOwnerEnt = doc.ownerId && this._toEntity(doc.ownerId, PeddlerEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				truckOwnerEnt = doc.ownerId && this._toEntity({ id: doc.ownerId }, PeddlerEnt, {
					_id: "id",
					streetAddress: "address",
				});
			}

			if (isType("object", doc.driverId) && !isObjectId(doc.driverId)) {
				driverEnt = doc.driverId && this._toEntity(doc.driverId, DriverEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				driverEnt = doc.driverId
					&& this._toEntity({ id: doc.driverId }, DriverEnt, {
						_id: "id",
						streetAddress: "address",
					});
			}

			if (isType("object", doc.productId) && !isObjectId(doc.productId)) {
				const entObj = doc.productId;

				productEnt = doc.productId && this._toEntity(entObj, ProductEnt, {
					_id: "id",
				});
			} else {
				productEnt = doc.productId && this._toEntity({ id: doc.productId }, ProductEnt, {
					_id: "id",
				});
			}

			const entObj = {
				...doc,
				owner: truckOwnerEnt,
				driver: driverEnt,
				product: doc.productPrice && productEnt && this._toEntity(
					{
						product: productEnt,
						...doc.productPrice,
						id: productEnt.id
					}, PeddlerProductEnt,
					{ _id: "id", productId: "product" }
				),
			};

			const truckEnt = this._toEntity(entObj, TruckEnt, {
				_id: "id",
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
			driver: "driverId",
		});
	}
};
