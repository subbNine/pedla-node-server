const BaseController = require("./base");
const { OrderDto } = require("../../entities/dtos");
const { orderService } = require("../../services");
const { orderStatus } = require("../../db/mongo/enums/order");

module.exports = class Order extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async getOrders(req, res, next) {
		const { user } = req._App;
		const { status } = req.query;

		const orderDto = new OrderDto();

		orderStatus;

		if (user.isDriver()) {
			orderDto.driver.id = user.id;
		}
		if (user.isBuyer()) {
			orderDto.buyer.id = user.id;
		}
		orderDto.status = status && {
			$in: status 
				? status.split("+").map((status) => ("" + status).toUpperCase().trim())
				: Object.values(orderStatus),
		};

		const result = await orderService.findOrders(orderDto);

		this.response(result, res);
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
		orderDto.buyerLatLon = {
			type: "Point",
			coordinates: [+buyerLon, +buyerLat],
		};
		orderDto.deliveryAddress = deliveryAddress;
		orderDto.deliveryDate = deliveryDate;
		orderDto.creditPaymentDate = creditPaymentDate;
		orderDto.paymentMethod = paymentMethod;

		const result = await orderService.createOrder(orderDto);

		this.response(result, res);
	}

	async confirmOrderDelivery(req, res, next) {
		const { orderId } = req.params;

		const orderDto = new OrderDto();

		orderDto.id = orderId;

		const result = await orderService.confirmOrderDelivery(orderDto);

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

	// cancelledReason
	async cancelOrder(req, res, next) {
		const { orderId } = req.params;
		const { reason } = req.body;

		const orderDto = new OrderDto();

		orderDto.id = orderId;
		orderDto.cancelledReason = reason;

		const result = await orderService.cancelOrder(orderDto);

		this.response(result, res);
	}
};
