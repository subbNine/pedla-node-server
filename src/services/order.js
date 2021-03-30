const toObjectId = require("mongoose").Types.ObjectId;

const { OrderEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const {
	order: { orderStatus, deliveryStatus },
} = require("../db/mongo/enums");
const { eventEmitter, eventTypes } = require("../events");
const Payment = require("./payment");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, computeStartOfDay } = utils;

module.exports = class Order {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async allOrderStat() {
		const { orderMapper } = this.mappers;

		const pendingOrdersQuery = orderMapper.countAllPendingOrders();

		const ordersInProgressQuery = orderMapper.countAllOrdersInProgress();

		const cancelledOrdersQuery = orderMapper.countAllCancelledOrders();

		const completedOrdersQuery = orderMapper.countAllCompletedOrders();

		const allOrdersQuery = orderMapper.countAllOrders();

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

		const numberOfOrders = await orderMapper.countDocsBy(search);

		if (numberOfOrders) {
			return Result.ok(numberOfOrders);
		} else {
			return Result.ok(0);
		}
	}

	async getOrders(orderFilterDto) {
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
				results.push(eachOrder.toDto());
			}

			return Result.ok(results);
		} else {
			return Result.ok([]);
		}
	}

	async getDriverOrders(order, options) {
		const { orderMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

		const totalDocs = await orderMapper.countDriverOrders(order);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundOrders = await orderMapper.findDriverOrders(order, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (foundOrders && foundOrders.length) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await Promise.all([
					this._loadPeddlerInfo(eachOrder),
					this._loadPayment(eachOrder),
				]);
				results.push(eachOrder.toDto());
			}

			return Result.ok({
				data: results,
				pagination: { totalPages, currentPage: +page || 1, totalDocs },
			});
		} else {
			return Result.ok([]);
		}
	}

	async getOrdersPaginated(orderFilterDto, options) {
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

		const totalDocs = await orderMapper.countDocsBy(search);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundOrders = await orderMapper.findOrders(search, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (foundOrders && foundOrders.length) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await Promise.all([
					this._loadPeddlerInfo(eachOrder),
					this._loadPayment(eachOrder),
				]);
				results.push(eachOrder.toDto());
			}

			return Result.ok({
				data: results,
				pagination: { totalPages, currentPage: +page || 1, totalDocs },
			});
		} else {
			return Result.ok([]);
		}
	}

	async getPeddlerOrders(peddler, orderFilter, options) {
		const { orderMapper, userMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

		const ownDrivers = await userMapper.findUsers({ peddler: peddler.id });

		let ownDriversId;

		if (ownDrivers) {
			ownDriversId = ownDrivers.map((each) => toObjectId(each._id));
		}

		if (ownDriversId) {
			const $and = [{ driverId: { $in: ownDriversId } }];

			if (orderFilter.status) {
				$and.push({ status: { $in: orderFilter.status } });
			}

			const search = {};

			if ($and && $and.length) {
				search.$and = $and;
			}

			const totalDocs = await orderMapper.countDocsBy(search);

			const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

			const foundOrders = await orderMapper.findOrders(search, {
				pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
			});

			if (foundOrders && foundOrders.length) {
				const results = [];

				for (const eachOrder of foundOrders) {
					await Promise.all([
						this._loadPeddlerInfo(eachOrder),
						this._loadPayment(eachOrder),
					]);
					results.push(eachOrder.toDto());
				}

				return Result.ok({
					data: results,
					pagination: { totalPages, currentPage: +page || 1, totalDocs },
				});
			}
		}
		return Result.ok([]);
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

		const totalDocs = await orderMapper.countDocsBy(filter);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundOrders = await orderMapper.findOrders(filter, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (foundOrders && foundOrders.length) {
			const results = [];

			for (const eachOrder of foundOrders) {
				await Promise.all([
					this._loadPeddlerInfo(eachOrder),
					this._loadPayment(eachOrder),
				]);
				results.push(eachOrder.toDto());
			}

			return Result.ok({
				data: results,
				pagination: { totalPages, currentPage: page || 1, totalDocs },
			});
		} else {
			return Result.ok([]);
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
			return Result.ok(foundOrder.toDto());
		} else {
			return Result.ok(null);
		}
	}

	async validateOrder(order) {
		const { truckMapper } = this.mappers;

		const truck = await truckMapper.findTruck({
			driverId: order.driver.id,
		});

		if (truck) {
			const truckQuantity = +truck.quantity;

			if (order.quantity) {
				if (order.quantity > truckQuantity) {
					return Result.fail(
						new AppError({
							name: errorCodes.InvalidOrderError.name,
							statusCode: errorCodes.InvalidOrderError.statusCode,
							message: errMessages.quantityOrderedGreaterThanAvailable,
						})
					);
				}
			} else {
				return Result.fail(
					new AppError({
						name: errorCodes.InvalidOrderError.name,
						statusCode: errorCodes.InvalidOrderError.statusCode,
						message: errMessages.invalidQuantity,
					})
				);
			}
		}
		return Result.ok(true);
	}

	async createOrder(order) {
		const { orderMapper } = this.mappers;
		const payment = new Payment({ mappers: this.mappers });

		const newOrder = await orderMapper.createOrder(new OrderEnt(order));

		eventEmitter.emit(eventTypes.orderCreated, newOrder, { nOrders: 1 });

		const paymentResp = await payment.initPayment(newOrder);

		return {
			id: newOrder.toDto().id,
			payment: paymentResp.getValue(),
		};
	}

	async placeOrder(order) {
		const vaidatedOrder = await this.validateOrder(order);

		if (vaidatedOrder.isFailure) {
			return vaidatedOrder;
		}

		const newOrder = await this.createOrder(order);

		if (newOrder) {
			return Result.ok(newOrder);
		}
		return Result.ok(null);
	}

	async _isOrderInProgress(driverId) {
		const { orderMapper } = this.mappers;
		return await orderMapper.findOrder({
			$and: [{ driverId }, { status: orderStatus.INPROGRESS }],
		});
	}

	async returnOrderedQuantityToTruck(order) {
		const { userMapper, truckMapper } = this.mappers;

		const updatedTruckAttchedToDriverPromise = userMapper.updateOrderedQuantityOnTruckAttachedToDriver(
			order
		);

		const updatedTruckPromise = truckMapper.updateOrderedQuantityInTruck(order);

		await Promise.all([
			updatedTruckAttchedToDriverPromise,
			updatedTruckPromise,
		]);

		return true;
	}

	async subtractOrderedQuantityFromTruck(order) {
		const { userMapper, truckMapper } = this.mappers;

		const orderInput = { ...order, quantity: -order.quantity };

		const updatedTruckAttchedToDriverPromise = userMapper.updateOrderedQuantityOnTruckAttachedToDriver(
			orderInput
		);

		const updatedTruckPromise = truckMapper.updateOrderedQuantityInTruck(
			orderInput
		);

		await Promise.all([
			updatedTruckAttchedToDriverPromise,
			updatedTruckPromise,
		]);

		return true;
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
			return Result.ok(updatedOrder.toDto());
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
			eventEmitter.emit(eventTypes.orderCompleted, updatedOrder, {
				nCompleted: 1,
			});

			return Result.ok(updatedOrder.toDto());
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
			eventEmitter.emit(eventTypes.orderRejected, updatedOrder, {
				nCancelled: 1,
			});

			return Result.ok(updatedOrder.toDto());
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
			return Result.ok(updatedOrder.toDto());
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
			eventEmitter.emit(eventTypes.orderAccepted, updatedOrder);

			return Result.ok(updatedOrder.toDto());
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
			return Result.ok(updatedOrder.toDto());
		} else {
			return Result.ok(null);
		}
	}

	async rateOrder(order) {
		const { orderMapper } = this.mappers;

		const orderEnt = new OrderEnt(order);

		const ratedOrder = await orderMapper.updateOrderById(order.id, orderEnt);

		if (ratedOrder) {
			eventEmitter.emit(eventTypes.orderRated, ratedOrder);
		}

		return Result.ok(updatedOrder.toDto());
	}

	async attachTruckToOrder(order) {
		const { orderMapper, userMapper } = this.mappers;

		return userMapper.findUser({ _id: order.driver.id }).then((driver) => {
			const truck = driver.truck;

			orderMapper
				.updateOrderById(order.id, { truckId: truck.truckId })
				.catch((err) => error(err));
		});
	}
};
