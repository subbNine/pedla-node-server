const BaseMapper = require("./base");
const {
	OrderEnt,
	UserEnt,
	PeddlerProductEnt,
	ProductEnt,
} = require("../entities/domain");
const isType = require("../lib/utils/is-type");
const {
	order: { deliveryStatus },
} = require("../db/mongo/enums");
const { Types } = require("mongoose");

module.exports = class OrderMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findOrders(filter, options) {
		const { Order } = this.models;
		const query = Order.find(filter)
			.sort({ createdAt: -1, status: -1 })
			.populate({ path: "productId", populate: { path: "productId" } })
			.populate("driverId")
			.populate("buyerId");

		const { pagination } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const orderEnt = this.toOrderEnt(doc.toObject());
				orderEnt.driver.driverStats = await this.driverOrderStats(
					orderEnt.driver.id
				);
				results.push(orderEnt);
			}

			return results;
		}
	}

	async driverOrderStats(driverId) {
		const { Order } = this.models;
		const nCancelledOrdersPromise = Order.countDocuments({
			$and: [
				{ driverId: driverId },
				{ deliveryStatus: deliveryStatus.REJECTED },
			],
		});

		const nCompleteOrdersPromise = Order.countDocuments({
			$and: [
				{ driverId: driverId },
				{ deliveryStatus: deliveryStatus.DELIVERED },
			],
		});

		const nAllOrdersPromise = Order.countDocuments({
			driverId: driverId,
		});

		const totalDriverRatingPromise = Order.aggregate([
			{
				$match: {
					driverId: Types.ObjectId(driverId),
				},
			},
			{
				$group: {
					_id: null,
					totalRating: {
						$sum: "$rating",
					},
				},
			},
		]);

		// const

		const [
			nCompleteOrders,
			nCancelledOrders,
			nAllOrders,
			totalDriverRatingArr,
		] = await Promise.all([
			nCompleteOrdersPromise,
			nCancelledOrdersPromise,
			nAllOrdersPromise,
			totalDriverRatingPromise,
		]);

		const percAcceptance = ((+nCompleteOrders || 0) / (+nAllOrders || 1)) * 100;
		const percCancelled = ((+nCancelledOrders || 0) / (+nAllOrders || 1)) * 100;
		const totalOrdersRating = nAllOrders * 5;

		const totalDriverRating =
			totalDriverRatingArr && totalDriverRatingArr.length
				? totalDriverRatingArr[0].totalRating
				: 0;

		const averageRating = (5 * +totalDriverRating) / totalOrdersRating;

		return {
			nCancelled: +nCancelledOrders || 0,
			nComplete: +nCompleteOrders || 0,
			percAcceptance: percAcceptance ? +percAcceptance.toFixed(2) : 0,
			percCancelled: percCancelled ? +percCancelled.toFixed(2) : 0,
			rating: averageRating ? +averageRating.toFixed(1) : 0,
		};
	}

	async countDocs(filter) {
		const { Order } = this.models;
		return await Order.countDocuments(filter);
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
			.populate({ path: "productId", populate: { path: "productId" } })
			.populate("driverId")
			.populate("buyerId");

		if (doc) {
			const orderEnt = this.toOrderEnt(doc.toObject());
			orderEnt.driver.driverStats = await this.driverOrderStats(
				orderEnt.driver.id
			);

			return orderEnt;
		}
	}

	async createOrder(orderEnt) {
		const { Order } = this.models;

		const newOrder = this.toOrderPersistence(orderEnt);

		const doc = await Order.create(newOrder);

		if (doc) {
			return this.toOrderEnt(doc.toObject());
		}
	}

	async updateOrderById(id, orderEnt) {
		const { Order } = this.models;

		const updates = this.toOrderPersistence(orderEnt);

		const doc = await Order.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this.toOrderEnt(doc.toObject());
		}
	}

	async updateOrderBy(filter, orderEnt) {
		const { Order } = this.models;

		const updates = this.toOrderPersistence(orderEnt);

		const doc = await Order.findOneAndUpdate(filter, updates, { new: true });

		if (doc) {
			return this.toOrderEnt(doc.toObject());
		}
	}

	async deleteOrder(id) {
		const { Order } = this.models;

		const doc = await Order.findByIdAndDelete(id);

		if (doc) {
			return this.toOrderEnt(doc.toObject());
		}
	}

	toOrderEnt(doc) {
		if (doc) {
			let driverEnt;
			let buyerEnt;
			let peddlerProductEnt;
			if (
				doc.driverId &&
				!Types.ObjectId.isValid(doc.driverId) &&
				doc.driverId._id
			) {
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

			if (
				doc.buyerId &&
				!Types.ObjectId.isValid(doc.buyerId) &&
				doc.buyerId._id
			) {
				buyerEnt = this._toEntity(doc.buyerId, UserEnt, {
					_id: "id",
					streetAddress: "address",
				});
			} else {
				buyerEnt = this._toEntity({ id: doc.buyerId }, UserEnt, {
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
				driver: driverEnt,
				buyer: buyerEnt,
				product: peddlerProductEnt,
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
