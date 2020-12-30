const BaseMapper = require("./base");
const {
	PaymentEnt,
	OrderEnt,
	UserEnt,
	PeddlerProductEnt,
	ProductEnt,
} = require("../entities/domain");

module.exports = class PaymentMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findPayment(filter) {
		const { Payment } = this.models;

		const doc = await Payment.findOne(this.toPaymentPersistence(filter))
			.populate("orderId.driverId")
			.populate("orderId.buyerId")
			.populate({ path: "productId", populate: { path: "productId" } });

		if (doc) {
			const docObj = doc.toObject();
			const order = this.toOrderEntity(docObj.orderId);

			const result = this.toPaymentEntity(Object.assign(docObj, { order }));

			return result;
		}
	}

	async findPayments(filterEnt) {
		const { Payment } = this.models;

		const docs = await Payment.find(this.toPaymentPersistence(filterEnt))
			// .populate("orderId")
			.populate("orderId");

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const docObj = doc.toObject();
				const order = this.toOrderEntity(docObj.orderId);
				results.push(this.toPaymentEntity(Object.assign(docObj, { order })));
			}

			return results;
		}
	}

	async createPayment(paymentEnt) {
		const { Payment } = this.models;

		const newPayment = this.toPaymentPersistence(paymentEnt);

		const doc = await Payment.create(newPayment);

		if (doc) {
			return this.toPaymentEntity(doc.toObject(), PaymentEnt);
		}
	}

	async updatePaymentById(id, orderPaymentEnt) {
		const { Payment } = this.models;

		const update = this.toPaymentPersistence(orderPaymentEnt);

		const doc = await Payment.findByIdAndUpdate(id, update, {
			new: true,
		}).populate("orderId");

		if (doc) {
			const docObj = doc.toObject();
			const order = this.toOrderEntity(docObj.orderId);

			return this.toPaymentEntity(Object.assign(docObj, { order }));
		}
	}

	toUserEntity(doc) {
		return this._toEntity(doc, UserEnt, {
			streetAddress: "address",
			_id: "id",
		});
	}

	toPaymentEntity(doc) {
		return this._toEntity(doc, PaymentEnt, {
			_id: "id",
			orderId: "order",
		});
	}

	toOrderEnt(doc) {
		if (doc) {
			let driverEnt;
			let buyerEnt;
			let peddlerProductEnt;
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

			if (doc.buyerId && doc.buyerId._id) {
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
		});
	}
};
