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

		const $and = [];

		if (orderFilterDto.driver.id) {
			$and.push({ driverId: orderFilterDto.driver.id });
		} else {
			if (orderFilterDto.buyer.id) {
				$and.push({ buyerId: orderFilterDto.buyer.id });
			}
		}

		if (orderFilterDto.status) {
			$and.push({ status: orderFilterDto.status });
		}

		const search = {
			$and,
		};

		const foundOrders = await orderMapper.findOrders(search);

		if (foundOrders) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await this.loadPeddlerCode(eachOrder);
				results.push(eachOrder.repr());
			}

			return Result.ok(results);
		} else {
			return Result.ok([]);
		}
	}

	async loadPeddlerCode(order) {
		const { userMapper } = this.mappers;

		const driver = await userMapper.findUser(
			{ _id: order.driver.id },
			(doc) => {
				doc.populate("peddler");
			}
		);

		if (driver && driver.peddler) {
			if (order.driver) {
				order.driver.peddlerCode = driver.peddler.peddlerCode;
			}
		}

		return order;
	}

	async findOrder(orderDto) {
		const { orderMapper } = this.mappers;

		const foundOrder = await orderMapper.findOrder(orderDto);

		if (foundOrder) {
			await this.loadPeddlerCode(foundOrder);
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
			$and: [{ driverId }, { status: orderStatus.ACCEPTED }],
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

	async rateTransaction(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id },
			orderEnt
		);
		return Result.ok({ id: updatedOrder.repr().id });
	}
};
