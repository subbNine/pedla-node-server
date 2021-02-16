const { OrderEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const {
	order: { orderStatus, deliveryStatus, paymentMethod },
} = require("../db/mongo/enums");
const { notification } = require("../index.js");
const Payment = require("./payment");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, computeStartOfDay } = utils;

module.exports = class Order {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async ordersStats() {
		const { orderMapper } = this.mappers;

		const pendingOrdersFilter = {
			status: orderStatus.PENDING,
		};

		const pendingOrdersQuery = orderMapper.countDocs(pendingOrdersFilter);

		const ordersInProgressFilter = {
			status: orderStatus.INPROGRESS,
		};

		const ordersInProgressQuery = orderMapper.countDocs(ordersInProgressFilter);

		const cancelledOrdersFilter = {
			deliveryStatus: deliveryStatus.REJECTED,
		};

		const cancelledOrdersQuery = orderMapper.countDocs(cancelledOrdersFilter);

		const completedOrdersFilter = {
			deliveryStatus: deliveryStatus.DELIVERED,
		};

		const completedOrdersQuery = orderMapper.countDocs(completedOrdersFilter);

		const allOrdersQuery = orderMapper.countDocs({});

		const [
			cancelledOrders,
			completedOrders,
			allOrders,
			pendingOrders,
			ordersInProgress,
		] = await Promise.all([
			cancelledOrdersQuery,
			completedOrdersQuery,
			allOrdersQuery,
			pendingOrdersQuery,
			ordersInProgressQuery,
		]);

		return Result.ok({
			cancelledOrders,
			completedOrders,
			allOrders,
			pendingOrders,
			ordersInProgress,
		});
	}

	async nOrders(orderFilterDto) {
		const { orderMapper } = this.mappers;

		const search = {
			status: { $in: orderFilterDto.status },
		};

		const numberOfOrders = await orderMapper.countDocs(search);

		if (numberOfOrders) {
			return Result.ok(numberOfOrders);
		} else {
			return Result.ok(0);
		}
	}

	async findOrders(orderFilterDto) {
		const { orderMapper } = this.mappers;

		const $and = [];

		if (orderFilterDto.driver.id) {
			$and.push({
				$or: [
					{
						driverId: orderFilterDto.driver.id,
						paymentMethod: { $ne: "credit" },
						paid: true,
					},
					{
						driverId: orderFilterDto.driver.id,
						paymentMethod: "credit",
					},
				],
			});
		} else {
			if (orderFilterDto.buyer.id) {
				$and.push({ buyerId: orderFilterDto.buyer.id });
			}
		}

		if (orderFilterDto.status) {
			$and.push({ status: { $in: orderFilterDto.status } });
		}

		const search = {
			$and,
		};

		const foundOrders = await orderMapper.findOrders(search);

		if (foundOrders) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await Promise.all([
					this._loadPeddlerInfo(eachOrder),
					this._loadPayment(eachOrder),
				]);
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
			$and.push({
				$or: [
					{
						driverId: orderFilterDto.driver.id,
						paymentMethod: { $ne: "credit" },
						paid: true,
					},
					{
						driverId: orderFilterDto.driver.id,
						paymentMethod: "credit",
					},
				],
			});
		} else {
			if (orderFilterDto.buyer.id) {
				$and.push({ buyerId: orderFilterDto.buyer.id });
			}
		}

		if (orderFilterDto.status) {
			$and.push({ status: { $in: orderFilterDto.status } });
		}

		const search = {};

		if ($and && $and.length) {
			search.$and = $and;
		}

		const totalDocs = await orderMapper.countDocs(search);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundOrders = await orderMapper.findOrders(search, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (foundOrders) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await Promise.all([
					this._loadPeddlerInfo(eachOrder),
					this._loadPayment(eachOrder),
				]);
				results.push(eachOrder.repr());
			}

			return Result.ok({
				data: results,
				pagination: { totalPages, currentPage: +page || 1, totalDocs },
			});
		} else {
			return Result.ok(null);
		}
	}

	async recentOrdersPaginated(orderFilterDto, options) {
		const { orderMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

		const startOfDay = computeStartOfDay();

		const $and = [{ createdAt: { $gte: startOfDay } }];

		if (orderFilterDto.status) {
			$and.push({ status: { $in: orderFilterDto.status } });
		}

		const filter = {};

		if ($and && $and.length) {
			filter.$and = $and;
		}

		const totalDocs = await orderMapper.countDocs(filter);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundOrders = await orderMapper.findOrders(filter, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (foundOrders) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await Promise.all([
					this._loadPeddlerInfo(eachOrder),
					this._loadPayment(eachOrder),
				]);
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

	async _loadPeddlerInfo(order) {
		const { userMapper } = this.mappers;

		const peddler = await userMapper.findUser({ _id: order.driver.peddler });

		if (peddler && peddler.peddlerCode) {
			if (order.driver) {
				order.driver.peddlerCode = peddler.peddlerCode;
				order.driver.peddler = peddler;
			}
		}

		return order;
	}

	async _loadPayment(order) {
		const { paymentMapper } = this.mappers;

		const payment = await paymentMapper.findPayment({ orderId: order.id });

		if (payment) {
			order.payment = payment;
		}

		return order;
	}

	async findOrder(orderDto) {
		const { orderMapper } = this.mappers;

		const foundOrder = await orderMapper.findOrder(orderDto);

		if (foundOrder) {
			await Promise.all([
				this._loadPeddlerInfo(foundOrder),
				this._loadPayment(foundOrder),
			]);
			return Result.ok(foundOrder.repr());
		} else {
			return Result.ok(null);
		}
	}

	async createOrder(order) {
		const { orderMapper } = this.mappers;
		const payment = new Payment({ mappers: this.mappers });

		const truck = await this._getTruck(order.driver);

		if (truck) {
			const truckQuantity = +truck.quantity;

			if (order.quantity) {
				if (order.quantity > truckQuantity) {
					return Result.fail(
						new AppError({
							name: errorCodes.InvalidOrderError,
							statusCode: errorCodes.InvalidOrderError.statusCode,
							message: errMessages.quantityOrderedGreaterThanAvailable,
						})
					);
				}
			} else {
				return Result.fail(
					new AppError({
						name: errorCodes.InvalidOrderError,
						statusCode: errorCodes.InvalidOrderError.statusCode,
						message: errMessages.invalidQuantity,
					})
				);
			}
		}

		const newOrder = await orderMapper.createOrder(new OrderEnt(order));

		const paymentResp = await payment.initPayment(newOrder);

		return Result.ok({
			id: newOrder.repr().id,
			payment: paymentResp.getValue(),
		});
	}

	async _getTruck(driver) {
		const { truckAndDriverMapper } = this.mappers;

		const truckAndDriver = await truckAndDriverMapper.findTruckAndDriver({
			driverId: driver.id,
		});

		if (truckAndDriver) {
			return truckAndDriver.truck;
		}
	}

	async _isOrderInProgress(driverId) {
		const { orderMapper } = this.mappers;
		return await orderMapper.findOrder({
			$and: [{ driverId }, { status: orderStatus.INPROGRESS }],
		});
	}

	async _returnOrderedQuantity(order) {
		const { peddlerProductMapper, truckMapper } = this.mappers;

		const orderedQuantity = order.quantity;
		const productId = String(order.product.id);

		const peddlerProductQtyUpdateQuery = peddlerProductMapper.updateProductById(
			productId,
			{
				$inc: { quantity: orderedQuantity },
			}
		);

		const truckQuery = this._getTruck(order.driver);

		const [peddlerProductQtyUpdate, truck] = await Promise.all([
			peddlerProductQtyUpdateQuery,
			truckQuery,
		]);

		if (truck) {
			truck.quantity = truck.quantity + order.quantity;

			return await truckMapper.updateTruckById(truck.id, truck);
		}
	}

	async _deductOrderedQuantity(order) {
		const { peddlerProductMapper, truckMapper } = this.mappers;

		const orderedQuantity = order.quantity;
		const productId = String(order.product.id);

		const peddlerProductQtyUpdateQuery = peddlerProductMapper.updateProductById(
			productId,
			{
				$inc: { quantity: -1 * orderedQuantity },
			}
		);

		const truckQuery = this._getTruck(order.driver);

		const [_peddlerProductQtyUpdate, truck] = await Promise.all([
			peddlerProductQtyUpdateQuery,
			truckQuery,
		]);

		if (truck) {
			truck.quantity = truck.quantity - order.quantity;

			return await truckMapper.updateTruckById(truck.id, truck);
		}
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
			return Result.ok(updatedOrder.repr());
		}

		return Result.ok(null);
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
			return Result.ok(updatedOrder.repr());
		}

		return Result.ok(null);
	}

	async rejectOrderDelivery(order, user) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.deliveryStatus = deliveryStatus.REJECTED;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id, status: orderStatus.COMPLETE, buyerId: order.buyer.id },
			orderEnt
		);

		if (updatedOrder) {
			this._returnOrderedQuantity(updatedOrder).then((res) =>
				console.log("success")
			);
			return Result.ok(updatedOrder.repr());
		} else {
			return Result.ok(null);
		}
	}

	async startOrderDelivery(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.INPROGRESS;

		const isOrderInProgress = await this._isOrderInProgress(order.driver.id);

		if (isOrderInProgress) {
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
			return Result.ok(updatedOrder.repr());
		} else {
			return Result.ok(null);
		}
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
			this._deductOrderedQuantity(updatedOrder).then((res) =>
				console.log("success")
			);

			return Result.ok(updatedOrder.repr());
		} else {
			return Result.ok(null);
		}
	}

	async cancelOrder(order, user) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);
		orderEnt.status = orderStatus.CANCELLED;

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id, status: orderStatus.PENDING },
			orderEnt
		);

		if (updatedOrder) {
			return Result.ok(updatedOrder.repr());
		} else {
			return Result.ok(null);
		}
	}

	async rateTransaction(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);

		const updatedOrder = await orderMapper.updateOrderBy(
			{ _id: order.id },
			orderEnt
		);
		return Result.ok(updatedOrder.repr());
	}
};
