const paymentGateway = require("../gateways/payment");
const { utils } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");

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

		const payment = { orderId: order.id, paymentMethod: order.paymentMethod };

		if (accessCode) {
			payment.gatewayAccessCode = accessCode;
		}

		if (reference) {
			payment.gatewayReference = reference;
		}

		const paymentRecord = await paymentMapper.createPayment(payment);

		return Result.ok(paymentRecord.repr());
	}
};
