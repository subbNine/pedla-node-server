const { OrderEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const {
	order: { orderStatus },
} = require("../db/mongo/enums");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class Order {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async findOrders(orderFilterDto) {
		const { orderMapper } = this.mappers;

		const foundOrders = await orderMapper.findOrders(orderFilterDto);

		if (foundOrders) {
			return Result.ok(foundOrders.map((eachOrder) => eachOrder.repr()));
		} else {
			return Result.ok([]);
		}
	}

	async findOrder(orderDto) {
		const { orderMapper } = this.mappers;

		const foundOrder = await orderMapper.findOrder(orderDto);

		if (foundOrder) {
			return Result.ok(foundOrder.repr());
		} else {
			return Result.ok(null);
		}
	}

	async createOrder(order) {
		const { orderMapper } = this.mappers;

		// ensure there is no pending order on the driver
		const pendingOrderOnDriver = await this._checkPendingOrderOnDriver(
			order.driver.id
		);

		if (pendingOrderOnDriver) {
			return Result.fail(
				new AppError({
					name: errorCodes.NotAcceptableOrderError.name,
					message: errMessages.notAcceptableOrder,
					statusCode: errorCodes.NotAcceptableOrderError.statusCode,
				})
			);
		}

		const newOrder = await orderMapper.createOrder(new OrderEnt(order));
		return Result.ok({ id: newOrder.repr().id });
	}

	async _checkPendingOrderOnDriver(driverId) {
		const { orderMapper } = this.mappers;
		return await orderMapper.findOrder({
			$and: [{ driverId }, { status: orderStatus.PENDING }],
		});
	}

	async _deductOrderedQuantityFromProduct(order) {
		const { peddlerProductMapper } = this.mappers;

		const orderedQuantity = order.quantity;
		const productId = String(order.product.id);

		await peddlerProductMapper.updateProductById(productId, {
			$inc: { quantity: -1 * orderedQuantity },
		});
	}

	async confirmOrderDelivery(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.COMPLETE;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id, status: orderStatus.PENDING },
			orderEnt
		);

		if (updatedOrder) {
			this._deductOrderedQuantityFromProduct(updatedOrder);

			return Result.ok({ id: updatedOrder.repr().id });
		}

		return Result.ok(true);
	}

	async acceptOrder(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.ACCEPTED;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id, driverId: order.driver.id, status: orderStatus.PENDING },
			orderEnt
		);

		if (updatedOrder) {
			return Result.ok({ id: updatedOrder.repr().id });
		}

		return Result.ok(true);
	}

	async cancelOrder(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.CANCELLED;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id },
			orderEnt
		);
		return Result.ok({ id: updatedOrder.repr().id });
	}

	rateTransaction() {
		throw new Error("Not implemented");
	}
};
