const BaseController = require("./base");
const { OrderDto } = require("../../entities/dtos");

const {} = (module.exports = class Order extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	requestPeddlerProduct(req, res, next) {
		const {
			driverId,
			buyerId,
			productId,
			quantity,
			unitAmount,
			driverLat,
			driverLon,
			buyerLat,
			buyerLon,
		} = req.body;

		const orderDto = new OrderDto();

		orderDto.driverId = driverId;
		orderDto.buyerId = buyerId;
		orderDto.productId = productId;
		orderDto.quantity = quantity;
		orderDto.unitAmount = unitAmount;
		orderDto.driverLatlon = {
			type: "Point",
			coordinates: [+driverLon, +driverLat],
		};
		orderDto.buyerLatlon = {
			type: "Point",
			coordinates: [+buyerLon, +buyerLat],
		};
	}

	confirmProductDelivery() {
		throw new Error("Not implemented");
	}

	rateTransaction() {
		throw new Error("Not implemented");
	}
});
