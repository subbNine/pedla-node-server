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

	async initPaystackPayment(order) {
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
		const driverEmail = driver.email;
		const buyerEmail = buyer.email;
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
						,
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
							display_name: "Driver's Name",
							variable_name: "driverName",
							value: driverName,
						},
						{
							display_name: "Driver's Email",
							variable_name: "driverEmail",
							value: driverEmail,
						},
					],
				],
			},
		};

		const paymentResp = await paymentGateway.initialize(params);

		const paymentRespData = {
			accessCode: paymentResp.data.access_code,
			authorizationUrl: "https://checkout.paystack.com/0peioxfhpn",
			reference: "7PVGX8MEk85tgeEpVDtD",
		};

		eventEmitter.emit(eventTypes.paymentInitialized, {
			order,
			payment: paymentRespData,
		});

		return paymentRespData;
	}

	async createPayment(order, { accessCode, reference }) {
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
		const { paymentMapper } = this.mappers;

		const paymentResp = await paymentGateway.verifyTransaction(ref);

		const paymentRespData = {};

		if (paymentResp && paymentResp.status) {
			paymentRespData.status = paymentResp.status;
			paymentRespData.data = { status: paymentResp.data.status };
			paymentRespData.data.amount = paymentResp.datadata.dataamount;
			paymentRespData.data.currency = paymentResp.data.currency;
			paymentRespData.data.message = paymentResp.data.gateway_response;

			if (paymentRespData.data.status === "success") {
				paymentMapper.updatePayment(
					{ gatewayReference: ref },
					{ status: paymentStatus.PAID }
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

	async updloadProofOfPayment(payment) {
		const { paymentMapper } = this.mappers;

		const updated = await paymentMapper.updatePayment(
			{ orderId: payment.orderId },
			payment
		);

		return Result.ok(updated);
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
		const { paymentMapper } = this.mappers;

		const verified = await paymentMapper.updatePayment(
			{ _id: paymentId },
			{ status: paymentStatus.PAID }
		);

		return Result.ok(verified);
	}
};
