const { UserEnt, DriverEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");
const { permissions, buyerTypes } = require("../db/mongo/enums/user");

const { Result, generateJwtToken } = utils;
const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;

module.exports = class User {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async updateBuyer(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let updatedBuyer = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedBuyer) {
			eventEmitter.emit(eventTypes.userProfileCreated, updatedBuyer);

			const objRepr = updatedBuyer.toDto();
			const token = generateJwtToken(objRepr);
			return Result.ok({ ...objRepr, token });
		}
	}

	async verifyRegisteredPeddler(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		userEnt.permission = permissions.PERM001;
		userEnt.isActivePeddler = true;
		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			eventEmitter.emit(eventTypes.peddlerVerified, updatedUser);

			const objRepr = updatedUser.toDto();
			return Result.ok({ ...objRepr });
		}
	}

	async activateCorporateBuyer(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		userEnt.isActive = true;
		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			const objRepr = updatedUser.toDto();
			return Result.ok({ ...objRepr });
		}
	}

	async rejectRegisteredPeddler(userDto) {
		const { userMapper } = this.mappers;

		userDto.isActivePeddler = false;

		const userEnt = new UserEnt(userDto);

		userEnt.isActivePeddler = false;

		let updatedUser = await userMapper.deactivatePeddler(userEnt.id);

		if (updatedUser) {
			eventEmitter.emit(eventTypes.peddlerRejected, updatedUser);

			const objRepr = updatedUser.toDto();
			return Result.ok({ ...objRepr });
		}
	}

	async getPeddlers(status, { pagination }) {
		const { userMapper } = this.mappers;

		const { limit, page } = pagination || {};

		const totalDocs = await userMapper.countDocsByVStatus(status);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const peddlers = await userMapper.findPeddlersByVStatus(status, {
			pagination: { limit, page: page ? page - 1 : 0 },
		});

		if (peddlers) {
			return Result.ok({
				data: peddlers.map((eachUser) => eachUser.toDto()),
				pagination: { totalPages, currentPage: page, totalDocs },
			});
		} else {
			return Result.ok([]);
		}
	}

	async getDriver(driverEnt) {
		const { userMapper } = this.mappers;

		const driver = await userMapper.findUser({ driverId: driverEnt.id });

		return Result.ok(driver.toDto());
	}

	async getDriverOrderStats(driverEnt) {
		const { orderMapper } = this.mappers;

		const stats = await orderMapper.driverOrderStats(driverEnt.id);

		driverEnt.driverStats = stats;

		return stats;
	}

	async getProfile(userId) {
		const { userMapper } = this.mappers;

		const user = await userMapper.findUser({ _id: userId }, (doc) => {
			doc.populate("peddler");
		});

		if (user) {
			return Result.ok(user.toDto());
		} else {
			return Result.ok(null);
		}
	}

	async updateProfile(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			const objRepr = updatedUser.toDto();
			return Result.ok({ ...objRepr });
		} else {
			return Result.ok(null);
		}
	}

	async togglePresence(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			const objRepr = updatedUser.toDto();
			return Result.ok({ id: objRepr.id, presence: objRepr.presence });
		} else {
			return Result.ok(null);
		}
	}

	async userExists(userDto) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		let user = await userMapper.searchFor(userEnt);

		if (user) {
			return Result.ok(true);
		} else {
			return Result.ok(false);
		}
	}

	async createDriver(userDto, peddler) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		const isAlreadyExistingUser = await userMapper.findUser({
			userName: userDto.userName,
		});

		if (isAlreadyExistingUser) {
			return Result.fail(
				new AppError({
					name: errorCodes.NameConflictError.name,
					message: errMessages.userNameConflict,
					statusCode: errorCodes.NameConflictError.statusCode,
				})
			);
		}

		userEnt.isActive = true;

		let newUser = await userMapper.createUser(userEnt);

		if (newUser) {
			eventEmitter.emit(
				eventTypes.driverCreated,
				Object.assign(newUser, {
					password: userDto.password,
					peddler: {
						firstName: peddler.firstName,
						lastName: peddler.lastName,
						id: peddler.Id,
						phoneNumber: peddler.phoneNumber,
					},
				})
			);

			return Result.ok({ success: true });
		} else {
			return Result.ok(null);
		}
	}

	async updateDriver(userDto, peddler) {
		const { userMapper } = this.mappers;
		const userEnt = new UserEnt(userDto);

		if (userDto.userName) {
			const isAlreadyExistingUser = await userMapper.findUser({
				$and: [
					{ userName: { $exists: true } },
					{
						userName: userEnt.userName,
					},
					{ _id: { $ne: userDto.id } },
				],
			});

			if (isAlreadyExistingUser) {
				return Result.fail(
					new AppError({
						name: errorCodes.NameConflictError.name,
						message: errMessages.userNameConflict,
						statusCode: errorCodes.NameConflictError.statusCode,
					})
				);
			}
		}

		let updatedUser = await userMapper.updateUserById(userEnt.id, userEnt);

		if (updatedUser) {
			eventEmitter.emit(
				eventTypes.driverUpdated,
				Object.assign(updatedUser, {
					peddler: {
						firstName: peddler.firstName,
						lastName: peddler.lastName,
						id: peddler.Id,
						email: peddler.email,
						phoneNumber: peddler.phoneNumber,
					},
				})
			);

			const objRepr = updatedUser.toDto();
			return Result.ok({ ...objRepr });
		} else {
			return Result.ok(null);
		}
	}

	async findDrivers(driverDto) {
		const { userMapper } = this.mappers;

		const foundUsers = await userMapper.findUsers(new DriverEnt(driverDto));

		if (foundUsers) {
			return Result.ok(foundUsers.map((each) => each.toDto()));
		}
		return Result.ok([]);
	}

	async getCorporateBuyers(options) {
		const { userMapper } = this.mappers;

		const { pagination, isActive } = options || {};
		const { limit, page } = pagination || {};

		const filter = {
			$and: [
				{ buyerType: buyerTypes.CORPORATE },
				{ corporateBuyerCacImg: { $exists: true } },
			],
		};

		if (+isActive === 0 || +isActive === 1) {
			filter.$and.push({ isActive: !!isActive });
		}

		const totalDocs = await userMapper.countDocs(filter);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundUsers = await userMapper.findUsers(filter, {
			pagination: { limit, page: page ? page - 1 : 0 },
		});

		if (foundUsers) {
			return Result.ok({
				data: foundUsers.map((eachUser) => eachUser.toDto()),
				pagination: { totalPages, currentPage: page, totalDocs },
			});
		} else {
			return Result.ok(null);
		}
	}

	async getUsers(listOfUserTypes, options) {
		const { userMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

		const filter = { type: { $in: listOfUserTypes } };

		const totalDocs = await userMapper.countDocs(filter);

		const totalPages = limit ? Math.ceil(totalDocs / +limit) : 1;

		const foundUsers = await userMapper.findUsers(filter, {
			pagination: { limit, page: page ? page - 1 : 0 },
			populate: (query) => query.populate("peddler"),
		});

		if (foundUsers) {
			return Result.ok({
				data: foundUsers.map((eachUser) => eachUser.toDto()),
				pagination: { totalPages, currentPage: page, totalDocs },
			});
		} else {
			return Result.ok(null);
		}
	}

	async nUsers(listOfUserTypes) {
		const { userMapper } = this.mappers;

		const filter = { type: { $in: listOfUserTypes } };

		const nUsers = await userMapper.countDocs(filter);

		if (nUsers) {
			return Result.ok(nUsers);
		} else {
			return Result.ok(0);
		}
	}

	async searchForProductDrivers(
		{ productId, quantity, geo },
		{ pagination: { page, limit } }
	) {
		const { userMapper } = this.mappers;

		const users = await userMapper.searchForProductDrivers(
			{
				productId,
				quantity,
				geo,
			},
			{ pagination: { page: page ? page - 1 : 0, limit: 4 * (limit || 10) } }
		);

		if (users) {
			return Result.ok(users);
		}
		return Result.ok([]);
	}

	async getSupportAgents() {
		const { userMapper } = this.mappers;

		const supportAgents = await userMapper.findSupportAgents();

		if (supportAgents) {
			return Result.ok(supportAgents.map((eachUser) => eachUser.toDto()));
		}
		return Result.ok(null);
	}

	async disableDriver(driverId) {
		const { userMapper } = this.mappers;

		const disabledDriver = await userMapper.disableDriver(driverId);

		if (disabledDriver) {
			eventEmitter.emit(eventTypes.driverDisabled, disabledDriver);

			return Result.ok(disabledDriver.toDto());
		}

		return Result.ok();
	}

	async enableDriver(driverId) {
		const { userMapper } = this.mappers;

		const disabledDriver = await userMapper.enableDriver(driverId);

		if (disabledDriver) {
			return Result.ok(disabledDriver.toDto());
		}

		return Result.ok();
	}

	async deleteDriver(driverId) {
		const { userMapper } = this.mappers;

		const deletedDriver = await userMapper.deleteDriver(driverId);

		if (deletedDriver) {
			eventEmitter.emit(eventTypes.driverDeleted, deletedDriver);

			return Result.ok(deletedDriver.toDto());
		}

		return Result.ok(null);
	}

	async rateDriver(order) {
		const { userMapper } = this.mappers;

		const { driver, rating: points } = order;

		const ratedDriver = await userMapper.rateDriver(driver, points);

		return Result.ok(ratedDriver ? ratedDriver.toDto() : null);
	}

	async detachTruckFromDriver(truck) {
		const { userMapper } = this.mappers;

		await userMapper.detachTruck(truck);

		return Result.ok(true);
	}

	async updateDriverOrderStats(driver, stats) {
		const { userMapper } = this.mappers;

		await userMapper.updateDriverOrderStats(driver, stats);

		return true;
	}

	async attachTruckToDriver(truck) {
		const { userMapper } = this.mappers;

		const truckOwner = await userMapper.findUser({ _id: truck.owner.id });

		const product = truckOwner.products.find(
			(p) => p.productId.toString() === truck.productId.toString()
		);

		const { id: truckId, productId, quantity } = truck;

		const driver = await userMapper.updateUserById(truck.driver.id, {
			truck: {
				truckId,
				productId,
				quantity,
				productPrice: {
					residentialAmt: product.residentialAmt,
					commercialAmt: product.commercialAmt,
					commercialOnCrAmt: product.commercialOnCrAmt,
				},
			},
		});

		return driver;
	}

	async updateProductQuantityOnTruckAttachedToDriver(truck) {
		const { userMapper } = this.mappers;

		const { id: truckId, ...rest } = truck;

		const driver = await userMapper.updateUserById(truck.driver.id, {
			truck: {
				truckId: truck.id,
				...rest,
			},
		});

		return driver;
	}

	async detachTruckFromOtherDriversButOne(truckEnt) {
		const { userMapper } = this.mappers;

		await userMapper.detachTruckFromOtherDriversButOne(truckEnt);

		return true;
	}

	async updateProductPriceOnTruckAttachedToDriver(
		newPrice,
		product,
		peddlerId
	) {
		const { userMapper } = this.mappers;

		return await userMapper.updateProductPriceOnTruckAttachedToDriver(
			newPrice,
			product,
			peddlerId
		);
	}

	async getPeddlerOnlineDrivers(peddler) {
		const { userMapper } = this.mappers;

		const drivers = await userMapper.findPeddlerOnlineDrivers(peddler);

		if (drivers) {
			return Result.ok(drivers.map((eachUser) => eachUser.toDto()));
		} else {
			return Result.ok([]);
		}
	}
};
