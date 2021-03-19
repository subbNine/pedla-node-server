const BaseController = require("./base");
const { OrderDto } = require("../../entities/dtos");
const { orderService, payment } = require("../../services");
const { orderStatus } = require("../../db/mongo/enums/order");
const { isValidDateTime } = require("../../lib/utils");

module.exports = class Order extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async countOrders(req, res, next) {
		const { status } = req.query;

		const orderDto = new OrderDto();

		orderDto.status = status
			? status
					.split(/,|\s+|\+/)
					.map((status) => ("" + status).toUpperCase().trim())
			: Object.values(orderStatus);

		const result = await orderService.nOrders(orderDto);

		this.response(result, res);
	}

	async ordersStats(req, res, next) {
		const result = await orderService.allOrderStat();

		this.response(result, res);
	}

	async recentOrders(req, res, next) {
		const { status, limit, page } = req.query;

		const orderDto = new OrderDto();

		orderDto.status = status
			? status
					.split(/,|\s+|\+/)
					.map((status) => ("" + status).toUpperCase().trim())
			: Object.values(orderStatus);

		const result = await orderService.recentOrdersPaginated(orderDto, {
			pagination: { limit, page },
		});

		this.response(result, res);
	}

	async getOrders(req, res, next) {
		const { user } = req._App;
		const { status, limit, page } = req.query;

		const orderDto = new OrderDto();

		if (user.isDriver()) {
			orderDto.driver.id = user.id;
		}
		if (user.isBuyer()) {
			orderDto.buyer.id = user.id;
		}
		orderDto.status = status
			? status
					.split(/,|\s+|\+/)
					.map((status) => ("" + status).toUpperCase().trim())
			: Object.values(orderStatus);

		if (!user.isAdmin()) {
			const result = await orderService.getOrders(orderDto);

			this.response(result, res);
		} else {
			const result = await orderService.getOrdersPaginated(orderDto, {
				pagination: { limit, page },
			});

			this.response(result, res);
		}
	}

	async getDriverOrders(req, res, next) {
		const { status, limit, page } = req.query;
		const { driverId } = req.params;

		const orderDto = new OrderDto();
		orderDto.driver.id = driverId;
		orderDto.status = status
			? status
					.split(/,|\s+|\+/)
					.map((status) => ("" + status).toUpperCase().trim())
			: Object.values(orderStatus);

		const result = await orderService.getDriverOrders(orderDto, {
			pagination: { limit, page },
		});

		this.response(result, res);
	}

	async getPeddlerOrders(req, res, next) {
		const { status, limit, page } = req.query;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.status = status
			? status
					.split(/,|\s+|\+/)
					.map((status) => ("" + status).toUpperCase().trim())
			: Object.values(orderStatus);

		const result = await orderService.getPeddlerOrders(user, orderDto, {
			pagination: { limit, page },
		});

		this.response(result, res);
	}

	async getOrderById(req, res, next) {
		const { orderId } = req.params;

		const orderDto = new OrderDto();

		orderDto.id = orderId;

		const result = await orderService.findOrder(orderDto);

		this.response(result, res);
	}

	async placeOrder(req, res, next) {
		const {
			driverId,
			productId,
			quantity,
			unitAmount,
			driverLat,
			driverLon,
			buyerLat,
			buyerLon,
			deliveryAddress,
			deliveryDate,
			creditPaymentDate,
			paymentMethod,
			priceCategory,
		} = req.body;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.buyer.id = user.id;

		if (driverId) {
			orderDto.driver.id = driverId;
		}

		if (productId) {
			orderDto.product.id = productId;
		}
		if (quantity) {
			orderDto.quantity = +quantity;
		}
		if (unitAmount) {
			orderDto.unitAmount = +unitAmount;
		}
		if (quantity && unitAmount) {
			orderDto.amount = +quantity * +unitAmount;
		}
		if (driverLat && driverLon) {
			orderDto.driverLatlon = {
				type: "Point",
				coordinates: [+driverLon, +driverLat],
			};
		}
		if (buyerLat && buyerLon) {
			orderDto.buyerLatlon = {
				type: "Point",
				coordinates: [+buyerLon, +buyerLat],
			};
		}
		if (deliveryAddress) {
			orderDto.deliveryAddress = deliveryAddress;
		}
		if (deliveryDate) {
			orderDto.deliveryDate = deliveryDate && new Date(deliveryDate);
		}
		if (creditPaymentDate && isValidDateTime(creditPaymentDate)) {
			orderDto.creditPaymentDate =
				creditPaymentDate && new Date(creditPaymentDate);
		}
		if (paymentMethod) {
			orderDto.paymentMethod = ("" + paymentMethod).toLowerCase();
		}
		if (priceCategory) {
			orderDto.priceCategory = priceCategory;
		}

		const result = await orderService.placeOrder(orderDto);

		this.response(result, res);
	}

	async completeOrder(req, res, next) {
		const { orderId } = req.params;

		const { user } = req._App;

		const orderDto = new OrderDto();
		orderDto.driver.id = user.id;

		orderDto.id = orderId;

		const result = await orderService.completeOrder(orderDto);

		this.response(result, res);
	}

	async confirmOrderDelivery(req, res, next) {
		const { orderId } = req.params;

		const { user } = req._App;

		const orderDto = new OrderDto();
		orderDto.buyer.id = user.id;

		orderDto.id = orderId;

		const result = await orderService.confirmOrderDelivery(orderDto);

		this.response(result, res);
	}

	async rejectOrderDelivery(req, res, next) {
		const { orderId } = req.params;

		const { user } = req._App;

		const orderDto = new OrderDto();
		orderDto.buyer.id = user.id;

		orderDto.id = orderId;

		const result = await orderService.rejectOrderDelivery(orderDto, user);

		this.response(result, res);
	}

	async acceptOrder(req, res, next) {
		const { orderId } = req.params;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.id = orderId;
		orderDto.driver.id = user.id;

		const result = await orderService.acceptOrder(orderDto);

		this.response(result, res);
	}

	async startDelivery(req, res, next) {
		const { orderId } = req.params;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.id = orderId;
		orderDto.driver.id = user.id;

		const result = await orderService.startOrderDelivery(orderDto);

		this.response(result, res);
	}

	async cancelOrder(req, res, next) {
		const { orderId } = req.params;
		const { reason } = req.body;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.id = orderId;
		orderDto.cancelledReason = reason;

		const result = await orderService.cancelOrder(orderDto, user);

		this.response(result, res);
	}

	async rateOrder(req, res, next) {
		const { orderId } = req.params;
		const { rating } = req.body;

		const orderDto = new OrderDto();

		orderDto.id = orderId;
		orderDto.rating = rating;

		const result = await orderService.rateOrder(orderDto);

		this.response(result, res);
	}

	async verifyPaystackPayment(req, res, next) {
		const { paymentRef } = req.params;

		const result = await payment.verifyPaystackPayment(paymentRef);

		this.response(result, res);
	}

	async uploadProofOfPayment(req, res, next) {
		const { orderId, imgUrl } = req.body;

		const { user } = req._App;

		const paymentObj = {
			orderId,
			proofOfPayment: {
				imgId: Date.now(),
				uri: imgUrl,
			},
		};

		const result = await payment.updloadProofOfPayment(paymentObj, user);

		this.response(result, res);
	}

	async verifyTransferPayment(req, res, next) {
		const { paymentId } = req.params;

		const result = await payment.verifyTransferPayment(paymentId);

		this.response(result, res);
	}

	async getUnverifiedPayments(req, res, next) {
		const { page, limit } = req.query;

		const result = await payment.getUnVerifiedPayments({
			pagination: { limit, page },
		});

		this.response(result, res);
	}
};
