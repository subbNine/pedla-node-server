const BaseMapper = require("./base");
const {
	PaymentEnt,
	OrderEnt,
	PeddlerProductEnt,
	ProductEnt,
	DriverEnt,
	BuyerEnt,
} = require("../entities/domain");
const { Types } = require("mongoose");
const { isType, isObjectId } = require("../lib/utils");

module.exports = class PaymentMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findPayment(filter, options) {
		const { Payment } = this.models;

		const { populateFn } = options || {};

		const q = Payment.findOne(this.toPaymentPersistence(filter));

		if (typeof populateFn === "function") {
			populateFn(q);
		}

		const doc = await q;
		if (doc) {
			const docObj = doc.toObject();

			let order;
			if (isType("object", docObj.orderId) && !isObjectId(docObj.orderId)) {
				order = this.createOrderEntity(docObj.orderId);
			} else {
				order = docObj.orderId;
			}

			const result = this.createPaymentEntity(Object.assign(docObj, { order }));

			return result;
		}
	}

	async countDocs(filter) {
		const { Payment } = this.models;
		return await Payment.countDocuments(filter);
	}

	async findPayments(filter, options) {
		const { Payment } = this.models;

		const { populateFn, pagination } = options || {};
		const { limit = 0, page = 0 } = pagination || {};

		const q = Payment.find(filter);

		if (typeof populateFn === "function") {
			populateFn(q);
		}

		if (limit) {
			q.limit(+limit);

			q.skip(+limit * +page);
		}

		const results = [];
		const docs = await q;
		if (docs) {
			for (const doc of docs) {
				const docObj = doc.toObject();
				let order;
				if (
					docObj.orderId &&
					!Types.ObjectId.isValid(docObj.orderId) &&
					docObj.orderId._id
				) {
					order = this.createOrderEntity(docObj.orderId);
				} else {
					order = docObj.orderId;
				}

				results.push(
					this.createPaymentEntity(Object.assign(docObj, { order }))
				);
			}

			return results;
		}
	}

	async createPayment(paymentEnt) {
		const { Payment } = this.models;

		const newPayment = this.toPaymentPersistence(paymentEnt);

		const doc = await Payment.create(newPayment);

		if (doc) {
			return this.createPaymentEntity(doc.toObject(), PaymentEnt);
		}
	}

	async updatePayment(filter, orderPaymentEnt) {
		const { Payment } = this.models;

		const updates = this.toPaymentPersistence(orderPaymentEnt);

		const doc = await Payment.findOneAndUpdate(filter, updates, {
			new: true,
		}).populate("orderId");

		if (doc) {
			const docObj = doc.toObject();
			const order = this.createOrderEntity(docObj.orderId);

			return this.createPaymentEntity(Object.assign(docObj, { order }));
		}
	}

	createPaymentEntity(doc) {
		return this._toEntity(doc, PaymentEnt, {
			_id: "id",
			orderId: "order",
			gatewayReference: "reference",
			gatewayAccessCode: "accessCode",
		});
	}

	createOrderEntity(doc) {
		if (doc) {
			let driverEnt;
			let buyerEnt;
			let peddlerProductEnt;
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

	toPaymentPersistence(ent) {
		return this._toPersistence(ent, {
			order: "orderId",
			buyer: "buyerId",
			driver: "driverId"
		});
	}
};
