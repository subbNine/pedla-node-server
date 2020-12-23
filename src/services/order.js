const { OrderEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const {
	order: { orderStatus, deliveryStatus },
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

	async findOrdersPaginated(orderFilterDto, options) {
		const { orderMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

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

		const search = {};

		if ($and && $and.length) {
			search.$and = $and;
		}

		const totalDocs = await orderMapper.countDocs(search);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundOrders = await orderMapper.findOrders(search, {
			pagination: { limit: limit || 30, page: page ? page - 1 : 0 },
		});

		if (foundOrders) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await this.loadPeddlerCode(eachOrder);
				results.push(eachOrder.repr());
			}

			return Result.ok({
				data: results,
				pagination: { totalPages, currentPage: page || 1, totalDocs },
			});
		} else {
			return Result.ok(null);
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

		const newOrder = await orderMapper.createOrder(new OrderEnt(order));
		return Result.ok({ id: newOrder.repr().id });
	}

	async _isExistingOrderInProgress(driverId) {
		const { orderMapper } = this.mappers;
		return await orderMapper.findOrder({
			$and: [{ driverId }, { status: orderStatus.INPROGRESS }],
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

	async completeOrder(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.COMPLETE;

		const updatedOrder = await orderMapper.updateOrderBy(
			{
				_id: order.id,
				status: orderStatus.INPROGRESS,
				driverId: order.driver.id,
			},
			orderEnt
		);

		if (updatedOrder) {
			return Result.ok({ id: updatedOrder.repr().id });
		}

		return Result.ok(true);
	}

	async confirmOrderDelivery(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.deliveryStatus = deliveryStatus.DELIVERED;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id, status: orderStatus.COMPLETE, buyerId: order.buyer.id },
			orderEnt
		);

		if (updatedOrder) {
			this._deductOrderedQuantityFromProduct(updatedOrder);

			return Result.ok({ id: updatedOrder.repr().id });
		}

		return Result.ok(true);
	}

	async rejectOrderDelivery(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.deliveryStatus = deliveryStatus.REJECTED;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id, status: orderStatus.COMPLETE, buyerId: order.buyer.id },
			orderEnt
		);

		if (updatedOrder) {
			this._deductOrderedQuantityFromProduct(updatedOrder);

			return Result.ok({ id: updatedOrder.repr().id });
		}

		return Result.ok(true);
	}

	async startOrderDelivery(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.INPROGRESS;

		const isExistingOrderInProgress = await this._isExistingOrderInProgress(
			order.driver.id
		);

		if (isExistingOrderInProgress) {
			return Result.fail(
				new AppError({
					name: errorCodes.BadRequestError,
					statusCode: errorCodes.BadRequestError.statusCode,
					message: errMessages.invalidOrderState,
				})
			);
		}

		const updatedOrder = await orderMapper.updateOrderBy(
			{
				_id: order.id,
				status: orderStatus.ACCEPTED,
				driverId: order.driver.id,
			},
			orderEnt
		);

		if (updatedOrder) {
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
			{ _id: order.id, status: orderStatus.PENDING },
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
