const BaseMapper = require("./base");
const {
	OrderEnt,
	ProductEnt,
	DriverEnt,
	BuyerEnt,
	TruckEnt,
} = require("../entities/domain");
const isType = require("../lib/utils/is-type");
const {
	order: { deliveryStatus, orderStatus },
} = require("../db/mongo/enums");
const isObjectId = require("../lib/utils/is-object-id");

module.exports = class OrderMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findOrders(filter, options) {
		const { Order } = this.models;
		const query = Order.find(filter)
			.sort({ createdAt: -1, status: -1 })
			.populate("productId")
			.populate("driverId")
			.populate("buyerId")
			.populate("truckId");

		const { pagination } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		const docs = await query;

		const results = [];
		if (docs && docs.length) {
			for (const doc of docs) {
				const orderEnt = this.createOrderEntity(doc.toObject());
				results.push(orderEnt);
			}

			return results;
		}
	}

	async countAllPendingOrders() {
		const filter = {
			status: orderStatus.PENDING,
		};

		return await this._countDocs(filter);
	}

	async countAllOrdersInProgress() {
		const filter = {
			status: orderStatus.INPROGRESS,
		};

		return await this._countDocs(filter);
	}

	async countAllCancelledOrders() {
		const filter = {
			deliveryStatus: deliveryStatus.REJECTED,
		};

		return await this._countDocs(filter);
	}

	async countAllCompletedOrders() {
		const filter = {
			deliveryStatus: deliveryStatus.DELIVERED,
		};

		return await this._countDocs(filter);
	}

	async countAllOrders() {
		return await this._countDocs({});
	}

	async countDocsBy(filter) {
		return await this._countDocs(filter);
	}

	async _countDocs(filter) {
		const { Order } = this.models;
		return await Order.countDocuments(filter);
	}

	async countDriverOrders(order) {
		const $and = [
			{ driverId: order.driver.id },
			{ status: { $in: order.status } },
		];

		return await this._countDocs({ $and });
	}

	async findDriverOrders(order, options) {
		const $and = [
			{ driverId: order.driver.id },
			{ status: { $in: order.status } },
		];

		const orders = await this.findOrders({ $and }, options);

		return orders
	}

	async findOrder(filter) {
		const { Order } = this.models;

		const { id, ...rest } = filter || {};

		const search = {};
		if (id) {
			search._id = id;
		}

		if (rest) {
			Object.assign(search, {
				...rest,
			});
		}

		const doc = await Order.findOne(this.toOrderPersistence(search))
			.populate({ path: "productId" })
			.populate("driverId")
			.populate("buyerId")
			.populate("truckId");

		if (doc) {
			const orderEnt = this.createOrderEntity(doc.toObject());

			return orderEnt;
		}
	}

	async createOrder(orderEnt) {
		const { Order } = this.models;

		const newOrder = this.toOrderPersistence(orderEnt);

		const doc = await Order.create(newOrder);

		if (doc) {
			return this.createOrderEntity(doc.toObject());
		}
	}

	async updateOrderById(id, orderEnt) {
		const { Order } = this.models;

		const updates = this.toOrderPersistence(orderEnt);

		const doc = await Order.findByIdAndUpdate(id, updates, { new: true })
			.populate("productId")
			.populate("driverId")
			.populate("buyerId")
			.populate("truckId");

		if (doc) {
			return this.createOrderEntity(doc.toObject());
		}
	}

	async updateOrderBy(filter, orderEnt) {
		const { Order } = this.models;

		const updates = this.toOrderPersistence(orderEnt);

		const doc = await Order.findOneAndUpdate(filter, updates, { new: true })
			.populate("productId")
			.populate("driverId")
			.populate("buyerId")
			.populate("truckId");

		if (doc) {
			return this.createOrderEntity(doc.toObject());
		}
	}

	async deleteOrder(id) {
		const { Order } = this.models;

		const doc = await Order.findByIdAndDelete(id);

		if (doc) {
			return this.createOrderEntity(doc.toObject());
		}
	}

	createOrderEntity(doc) {
		if (doc) {
			let driverEnt;
			let buyerEnt;
			let productEnt;
			let truckEnt;
			if (isType("object", doc.driverId) && !isObjectId(doc.driverId)) {
				driverEnt = this._toEntity(doc.driverId, DriverEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				driverEnt = this._toEntity({ id: doc.driverId }, DriverEnt, {
					_id: "id",
					streetAddress: "address",
				});
			}

			if (isType("object", doc.buyerId) && !isObjectId(doc.buyerId)) {
				buyerEnt = this._toEntity(doc.buyerId, BuyerEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				buyerEnt = this._toEntity({ id: doc.buyerId }, BuyerEnt, {
					_id: "id",
					streetAddress: "address",
				});
			}

			if (isType("object", doc.productId) && !isObjectId(doc.productId)) {
				const entObj = doc.productId;

				productEnt = this._toEntity(entObj, ProductEnt, {
					_id: "id",
				});
			} else {
				productEnt = this._toEntity({ id: doc.productId }, ProductEnt, {
					_id: "id",
				});
			}

			if (isType("object", doc.truckId) && !isObjectId(doc.truckId)) {
				const entObj = doc.truckId;

				truckEnt = this._toEntity(entObj, TruckEnt, {
					_id: "id",
					productId: "product"
				});
			} else {
				truckEnt = this._toEntity({ id: doc.truckId }, TruckEnt, {
					_id: "id",
					productId: "product"
				});
			}

			driverEnt.truck = truckEnt

			const entObj = {
				...doc,
				driver: driverEnt,
				buyer: buyerEnt,
				product: productEnt,
			};

			const orderEnt = this._toEntity(entObj, OrderEnt, {
				_id: "id",
				driverId: "driver",
				buyerId: "buyer",
				productId: "product",
			});

			return orderEnt;
		}
	}

	toOrderPersistence(ent) {
		if (ent.product) {
			if (ent.product.id) {
				ent.product = ent.product.id;
			} else {
				ent.product = typeof ent.product === "object" ? undefined : ent.product;
			}
		}

		if (ent.driver) {
			if (ent.driver.id) {
				ent.driver = ent.driver.id;
			} else {
				ent.driver = typeof ent.driver === "object" ? undefined : ent.driver;
			}
		}

		if (ent.buyer) {
			if (ent.buyer.id) {
				ent.buyer = ent.buyer.id;
			} else {
				ent.buyer = typeof ent.buyer === "object" ? undefined : ent.buyer;
			}
		}

		return this._toPersistence(ent, {
			product: "productId",
			driver: "driverId",
			buyer: "buyerId",
		});
	}
};
