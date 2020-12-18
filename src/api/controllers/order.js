const BaseController = require("./base");
const { OrderDto } = require("../../entities/dtos");
const { orderService } = require("../../services");

const {} = (module.exports = class Order extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
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
		} = req.body;

		const { user } = req._App;

		const orderDto = new OrderDto();

		orderDto.driver.id = driverId;
		orderDto.buyer.id = user.id;
		orderDto.product.id = productId;
		orderDto.quantity = +quantity;
		orderDto.unitAmount = +unitAmount;
		orderDto.amount = +quantity * +unitAmount;
		orderDto.driverLatlon = {
			type: "Point",
			coordinates: [+driverLon, +driverLat],
		};
		orderDto.buyerLatLon = {
			type: "Point",
			coordinates: [+buyerLon, +buyerLat],
		};

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
});
