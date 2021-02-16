const paymentGateway = require("../gateways/payment");
const { utils, error } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");
const { paymentStatus, paymentMethod } = require("../db/mongo/enums/order");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const { formatNumber, Result } = utils;

module.exports = class Payment {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async _initPaystackPayment(order) {
		const { peddlerProductMapper, userMapper } = this.mappers;

		const peddlerProductId = order.product.id;
		const buyerId = order.buyer.id;
		const driverId = order.driver.id;

		const driverPromise = userMapper.findUser({ _id: driverId }, (q) =>
			q.populate("peddler")
		);

		const buyerPromise = userMapper.findUser({ _id: buyerId });

		const peddlerProductPromise = peddlerProductMapper.findProduct({
			_id: peddlerProductId,
		});

		const [driver, buyer, peddlerProduct] = await Promise.all([
			driverPromise,
			buyerPromise,
			peddlerProductPromise,
		]);

		const productType = peddlerProduct.product.name;
		const driverPhone = driver.phoneNumber;
		const buyerEmail = buyer.email;
		const buyerPhone = buyer.phoneNumber;
		const driverName = `${driver.firstName} ${driver.lastName}`;
		const buyerName = `${buyer.firstName} ${buyer.lastName}`;
		const peddlerCode = driver.peddler.peddlerCode;
		const unitAmount = `${formatNumber(order.unitAmount)} ngn`;
		const amount = order.amount;
		const quantity = formatNumber(order.quantity);

		const params = {
			email: buyerEmail,
			amount: amount * 100,
			metadata: {
				custom_fields: [
					[
						{
							display_name: "Product Ordered",
							variable_name: "productType",
							value: productType,
						},
						{
							display_name: "Product Unit Price ",
							variable_name: "unitAmount",
							value: unitAmount,
						},
						{
							display_name: "Quantity (litre)",
							variable_name: "quantity",
							value: quantity,
						},
						{
							display_name: "Peddler's Code",
							variable_name: "peddlerCode",
							value: peddlerCode,
						},
						{
							display_name: "Buyer's Name",
							variable_name: "buyerName",
							value: buyerName,
						},
						{
							display_name: "Buyer's Email",
							variable_name: "buyerEmail",
							value: buyerEmail,
						},
						{
							display_name: "Buyer's Phone Number",
							variable_name: "buyerPhone",
							value: buyerPhone,
						},
						{
							display_name: "Driver's Name",
							variable_name: "driverName",
							value: driverName,
						},
						{
							display_name: "Driver's Phone Number",
							variable_name: "driverPhone",
							value: driverPhone,
						},
					],
				],
			},
		};

		const paymentResp = await paymentGateway.initialize(params);

		const paymentRespData = {
			accessCode: paymentResp.data.access_code,
			authorizationUrl: paymentResp.data.authorization_url,
			reference: paymentResp.data.reference,
		};

		eventEmitter.emit(eventTypes.paymentInitialized, {
			order,
			payment: paymentRespData,
		});

		return Result.ok(paymentRespData);
	}

	async initPayment(order, options) {
		let paymentResp;
		if (order.paymentMethod === paymentMethod.paystack) {
			paymentResp = await this._initPaystackPayment(order, options);
		} else {
			paymentResp = await this.createPayment(order, options);
		}

		return paymentResp;
	}

	async createPayment(order, { accessCode, reference } = {}) {
		const { paymentMapper } = this.mappers;

		const payment = {
			orderId: order.id,
			buyerId: order.buyer.id,
			driverId: order.driver.id,
			paymentMethod: order.paymentMethod,
		};

		if (accessCode) {
			payment.gatewayAccessCode = accessCode;
		}

		if (reference) {
			payment.gatewayReference = reference;
		}

		const paymentRecord = await paymentMapper.createPayment(payment);

		return Result.ok(paymentRecord.repr());
	}

	async verifyPaystackPayment(ref) {
		const { paymentMapper, orderMapper } = this.mappers;

		const paymentResp = await paymentGateway.verifyTransaction(ref);

		const paymentRespData = {};

		if (paymentResp && paymentResp.status) {
			paymentRespData.status = paymentResp.status;
			paymentRespData.data = { status: paymentResp.data.status };
			paymentRespData.data.amount = paymentResp.data.amount;
			paymentRespData.data.currency = paymentResp.data.currency;
			paymentRespData.data.message = paymentResp.data.gateway_response;

			if (paymentRespData.data.status === "success") {
				const updatedPayment = await paymentMapper.updatePayment(
					{ gatewayReference: ref },
					{ status: paymentStatus.PAID }
				);

				if (updatedPayment.order.id) {
					await orderMapper.updateOrderById(updatedPayment.order.id, {
						paid: true,
					});
				}
			} else {
				return Result.fail(
					new AppError({
						name: errorCodes.PaymentError.name,
						statusCode: errorCodes.PaymentError.statusCode,
						message: paymentRespData.data.message,
					})
				);
			}

			return Result.ok(paymentRespData);
		} else {
			return Result.fail(
				new AppError({
					name: errorCodes.PaymentError.name,
					statusCode: errorCodes.PaymentError.statusCode,
					message: paymentResp.message,
				})
			);
		}
	}

	async updloadProofOfPayment(payment, buyer) {
		const { paymentMapper } = this.mappers;

		const updated = await paymentMapper.updatePayment(
			{ orderId: payment.orderId, buyerId: buyer.id },
			payment
		);

		if (updated) {
			const obj = updated.repr();

			return Result.ok({ ...obj, order: { id: obj.order.id } });
		} else {
			return Result.ok(null);
		}
	}

	async getUnVerifiedPayments({ pagination: { page, limit } }) {
		const { paymentMapper } = this.mappers;

		const notPaid = { status: paymentStatus.NOTPAID };

		const notInitializedViaPaystackChannel = {
			paymentMethod: { $ne: paymentMethod.paystack },
		};

		const popUploaded = { proofOfPayment: { $exists: true } };

		const unVerifiedPaymentQueryObj = {
			$and: [notPaid, notInitializedViaPaystackChannel, popUploaded],
		};

		const totalDocsQuery = paymentMapper.countDocs(unVerifiedPaymentQueryObj);

		const unverifiedPaymentsQuery = paymentMapper.findPayments(
			unVerifiedPaymentQueryObj,
			{
				pagination: { page: page ? +page - 1 : 0, limit: +limit || 30 },
				populateFn: (q) =>
					q
						.populate({ path: "orderId", populate: { path: "productId" } })
						.populate({ path: "buyerId" })
						.populate({ path: "driverId" }),
			}
		);

		const [totalDocs, unverifiedPayments] = await Promise.all([
			totalDocsQuery,
			unverifiedPaymentsQuery,
		]);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		if (unverifiedPayments) {
			const results = [];

			for (const eachPayment of unverifiedPayments) {
				results.push(eachPayment.repr());
			}

			return Result.ok({
				data: results,
				pagination: { totalPages, currentPage: +page || 1, totalDocs },
			});
		} else {
			return Result.ok(null);
		}
	}

	async verifyTransferPayment(paymentId) {
		const { paymentMapper, orderMapper } = this.mappers;

		const verified = await paymentMapper.updatePayment(
			{ _id: paymentId, paymentMethod: { $ne: paymentMethod.paystack } },
			{ status: paymentStatus.PAID }
		);

		if (updatedPayment.order.id) {
			await orderMapper.updateOrderById(updatedPayment.order.id, {
				paid: true,
			});
		}

		return Result.ok(
			(verified && { ...verified, order: { id: verified.order.id } }) || null
		);
	}
};
