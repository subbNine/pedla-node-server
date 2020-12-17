const BaseMapper = require("./base");
const {
	TruckEnt,
	UserEnt,
	PeddlerProductEnt,
	ProductEnt,
} = require("../entities/domain");
const isType = require("../lib/utils/is-type");

module.exports = class OrderMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findOrders(filter) {}

	async findTruck(filter) {}

	async createTruck(truckEnt) {
		const { Order } = this.models;

		const newTruck = this.toTruckPersistence(truckEnt);

		const doc = await Order.create(newTruck);

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	async updateTruckById(id, truckEnt) {
		const { Order } = this.models;

		const updates = this.toTruckPersistence(truckEnt);

		const doc = await Order.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	async deleteTruck(id) {
		const { Order } = this.models;

		const doc = await Order.findByIdAndDelete(id);

		if (doc) {
			return this.toTruckEnt(doc.toObject());
		}
	}

	toTruckEnt(doc) {
		if (doc) {
			let userEnt;
			let peddlerProductEnt;
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
				const entObj = doc.productId;

				peddlerProductEnt = this._toEntity(entObj, PeddlerProductEnt, {
					_id: "id",
				});

				if (isType("object", entObj.productId)) {
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
