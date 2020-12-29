const BaseController = require("./base");
const { OrderDto } = require("../../entities/dtos");
const { orderService } = require("../../services");
const { orderStatus } = require("../../db/mongo/enums/order");

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
		const result = await orderService.ordersStats();

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
			const result = await orderService.findOrders(orderDto);

			this.response(result, res);
		} else {
			const result = await orderService.findOrdersPaginated(orderDto, {
				pagination: { limit, page },
			});

			this.response(result, res);
		}
	}

	async getOrderById(req, res, next) {
		const { orderId } = req.params;

		const orderDto = new OrderDto();

		orderDto.id = orderId;

		const result = await orderService.findOrder(orderDto);

		this.response(result, res);
	}

	async createOrder(req, res, next) {
		const {
			driverId,
			productId,
			quantity,
			unitAmount,
			driverLat,
			driverLon,
			buyerLat,
			buyerLon,
			amount,
			deliveryAddress,
			deliveryDate,
			creditPaymentDate,
			paymentMethod,
			priceCategory,
		} = req.body;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.driver.id = driverId;
		orderDto.buyer.id = user.id;
		orderDto.product.id = productId;
		orderDto.quantity = +quantity;
		orderDto.unitAmount = +unitAmount;
		orderDto.amount = +amount;
		orderDto.driverLatlon = {
			type: "Point",
			coordinates: [+driverLon, +driverLat],
		};
		orderDto.buyerLatlon = {
			type: "Point",
			coordinates: [+buyerLon, +buyerLat],
		};
		orderDto.deliveryAddress = deliveryAddress;
		orderDto.deliveryDate = deliveryDate && new Date(deliveryDate);
		orderDto.creditPaymentDate =
			creditPaymentDate && new Date(creditPaymentDate);
		orderDto.paymentMethod = paymentMethod;
		orderDto.priceCategory = priceCategory;

		const result = await orderService.createOrder(orderDto);

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

		const result = await orderService.rateTransaction(orderDto);

		this.response(result, res);
	}
};
