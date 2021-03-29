const BaseMapper = require("./base");

const isObjectEmpty = require("../lib/utils/is-object-empty");
const {
	GeoEnt,
	PeddlerEnt,
	DriverEnt,
	BuyerEnt,
	UserEnt,
	TruckEnt,
	ProductEnt
} = require("../entities/domain");
const { presence } = require("../db/mongo/enums/user");
const {
	user: { types },
} = require("../db/mongo/enums");
const { isObjectId, isType } = require("../lib/utils");

module.exports = class UserMapper extends BaseMapper {
	_toEntityTransform = {
		_id: "id",
		streetAddress: "address",
	};

	_toPersistenceTransform = {
		address: "streetAddress",
	};

	constructor(models) {
		super();
		this.models = models;
	}

	async findUser(filter, populateFn) {
		const { User } = this.models;

		const search = this._toPersistence(filter, this._toPersistenceTransform);
		const query = User.findOne(search);

		if (populateFn) {
			populateFn(query);
		}

		query.where({
			$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
		});

		const doc = await query;
		if (doc) {
			const entObj = doc.toObject();

			if (isType("object", entObj.peddler) && !isObjectId(entObj.peddler)) {
				entObj.peddler = this.createUserEntity(entObj.peddler);
			}

			let userEnt = this.createUserEntity(entObj);

			return userEnt;
		}
	}

	async countDocsByVStatus(status) {
		const { User } = this.models;

		const PEDDLER_STATUS = {
			uncategorized: "uncategorized",
			verified: "verified",
			unverified: "unverified",
		};

		const search = { type: types.PEDDLER };

		if (status === PEDDLER_STATUS.uncategorized) {
			search.isActivePeddler = { $exists: false };
		} else {
			if (status === PEDDLER_STATUS.verified) {
				search.isActivePeddler = true;
			} else {
				if (status === PEDDLER_STATUS.unverified) {
					search.isActivePeddler = false;
				}
			}
		}

		return await User.countDocuments(search);
	}

	async countDocs(filter) {
		const { User } = this.models;
		return await User.countDocuments(filter);
	}

	async findSupportAgents() {
		const supportAgents = await this.findUsers({ type: types.ADMIN });

		return supportAgents;
	}

	async findPeddlerOnlineDrivers(peddler) {
		const { User } = this.models;
		const query = User.find({
			$and: [
				{ peddler: peddler.id },
				{ type: types.DRIVER },
				{
					presence: presence.ONLINE,
				}
			],
		})
			.populate("truck.truckId")
			.populate("truck.productId");

		query.where({
			$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
		});

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const obj = doc.toObject();
				const userEnt = this.createUserEntity(obj);

				results.push(userEnt);
			}

			return results;
		}
	}

	async findUsers(filter, options) {
		const { User } = this.models;
		const query = User.find(this._toPersistence(filter));

		const { pagination, populate } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		if (populate && typeof populate === "function") {
			populate(query);
		}

		query.where({
			$or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
		});

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const obj = doc.toObject();
				const userEnt = this.createUserEntity(obj);

				if (doc.peddler && !isObjectId(doc.peddler)) {
					userEnt.peddler = this.createUserEntity(obj.peddler);
				}

				results.push(userEnt);
			}

			return results;
		}
	}

	async findPeddlersByVStatus(status, { pagination: { limit, page } }) {
		const { User } = this.models;

		const PEDDLER_STATUS = {
			uncategorized: "uncategorized",
			verified: "verified",
			unverified: "unverified",
		};

		const search = { type: types.PEDDLER };

		if (status === PEDDLER_STATUS.uncategorized) {
			search.isActivePeddler = { $exists: false };
		} else {
			if (status === PEDDLER_STATUS.verified) {
				search.isActivePeddler = true;
			} else {
				if (status === PEDDLER_STATUS.unverified) {
					search.isActivePeddler = false;
				}
			}
		}

		const query = User.find(search);

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const obj = doc.toObject();
				const user = this.createUserEntity(obj);
				results.push(user);
			}

			return results;
		}
	}

	async createUser(userEnt) {
		const { User } = this.models;

		const newUser = this._toPersistence(userEnt, this._toPersistenceTransform);

		const doc = await User.create(newUser);
		if (doc) {
			const obj = doc.toObject();
			return this.createUserEntity(obj);
		}
	}

	async updateUser(filter, updates) {
		const { User } = this.models;

		const doc = await User.findOne(filter);
		if (doc) {
			Object.assign(doc, updates);

			const saved = await doc.save();

			return this.createUserEntity(saved.toObject());
		}
	}

	async resetUserPassword(
		newPassword,
		{ passwordResetCode, passwordResetToken }
	) {
		const { User } = this.models;

		const doc = await User.findOne({
			$and: [
				{ passwordResetToken },
				{ passwordResetCode },
				// { passwordResetExpires: { $gt: new Date() } },
			],
		});

		if (doc) {
			doc.password = newPassword;
			doc.passwordResetCode = undefined;
			doc.passwordResetToken = undefined;
			doc.passwordResetExpires = undefined;

			const saved = await doc.save();

			return this.createUserEntity(saved.toObject());
		}
	}

	async updateUserById(userId, userEntUpdate) {
		const { User } = this.models;

		const updates = this._toPersistence(
			userEntUpdate,
			this._toPersistenceTransform
		);

		const doc = await User.findByIdAndUpdate(userId, updates, {
			new: true,
		});

		if (updates.password) {
			doc.password = updates.password;
			await doc.save();
		}

		if (doc) {
			return this.createUserEntity(doc.toObject());
		}
	}

	async deactivatePeddler(userId) {
		const { User } = this.models;

		const doc = await User.findByIdAndUpdate(
			userId,
			{ isActivePeddler: false },
			{
				new: true,
			}
		);

		if (doc) {
			return this.createUserEntity(doc.toObject());
		}
	}

	async setPasswordAndUserName(userId, userEntUpdate) {
		const { User } = this.models;

		const foundUser = await User.findById(userId);

		foundUser.password = userEntUpdate.password;
		foundUser.userName = userEntUpdate.userName;

		const savedDoc = await foundUser.save();

		if (savedDoc) {
			return this.createUserEntity(savedDoc.toObject());
		}
	}

	async searchFor(userEnt) {
		const { User } = this.models;

		let matchEmailOrUserName = {};

		if (userEnt.email) {
			matchEmailOrUserName.$or = [];
			const matchEmail = { email: new RegExp(userEnt.email, "i") };
			matchEmailOrUserName.$or.push(matchEmail);
		}

		if (userEnt.userName) {
			if (!matchEmailOrUserName.$or) {
				matchEmailOrUserName.$or = [];
			}
			const matchUserName = {
				userName: new RegExp(userEnt.userName, "i"),
			};
			matchEmailOrUserName.$or.push(matchUserName);
		}

		const doc = await User.findOne(matchEmailOrUserName);

		if (doc && !isObjectEmpty(matchEmailOrUserName)) {
			const entObj = doc.toObject();
			let userEnt = this.createUserEntity(entObj);

			return userEnt;
		}
	}

	async updateDriverOrderStats(driver, stats) {
		const { User } = this.models;

		const updates = { $inc: {} };

		if (stats.nCancelled) {
			updates.$inc["orderStats.nCancelled"] = stats.nCancelled;
		}

		if (stats.nCompleted) {
			updates.$inc["orderStats.nCompleted"] = stats.nCompleted;
		}

		if (stats.nOrders) {
			updates.$inc["orderStats.nOrders"] = stats.nOrders;
		}

		return await User.findByIdAndUpdate(driver.id, updates);
	}

	async searchForProductDrivers({ productId, quantity, geo }, options) {
		const { User } = this.models;

		const { pagination } = options || {};
		const { page, limit } = pagination || {};

		const geoEnt = new GeoEnt(geo);
		const lat = geoEnt.getLat();
		const lon = geoEnt.getLon();

		const drivers = await User.find({
			$and: [
				{ type: types.DRIVER },
				{ presence: presence.ONLINE },
				{ "truck.productId": productId },
				{ "truck.quantity": { $gte: quantity } },
				{
					latlon: {
						$nearSphere: {
							$geometry: {
								type: "Point",
								coordinates: [+lon, +lat],
							},
							$maxDistance: 1000,
						},
					},
				},
			],
		})
			.skip(page)
			.limit(limit)
			.populate("peddler")
			.populate("truck.truckId")
			.populate("truck.productId")

		const driversList = [];

		if (drivers && drivers.length) {
			for (let driver of drivers) {
				const peddlerEnt = this.createUserEntity(driver.peddler);

				const driverEnt = this.createUserEntity(driver);

				driverEnt.peddler = peddlerEnt;
				driverEnt.peddlerCode = peddlerEnt.peddlerCode;

				driversList.push(driverEnt.toDto());
			}
		}

		return driversList;
	}

	async disableDriver(driverId) {
		const { User } = this.models;

		const doc = await User.findOneAndUpdate(
			{
				_id: driverId,
				type: types.DRIVER,
			},
			{
				isActive: false,
				$unset: { truck: "" },
			},
			{ new: true }
		);

		if (doc) {
			return this.createUserEntity(doc.toObject());
		}
	}

	async enableDriver(driverId) {
		const { User } = this.models;

		const doc = await User.findOneAndUpdate(
			{ _id: driverId, type: types.DRIVER },
			{ isActive: true },
			{ new: true }
		);

		if (doc) {
			return this.createUserEntity(doc.toObject());
		}
	}

	async rateDriver(driver, points) {
		return await this.updateUserById(driver.id, {
			$inc: { "rating.totalRating": +points, "rating.ratingCount": 1 },
		});
	}

	async deleteDriver(driverId) {
		const { User } = this.models;

		const doc = await User.findOneAndUpdate(
			{ _id: driverId, type: types.DRIVER },
			{ isDeleted: true, $unset: { truck: "" } },
			{
				new: true,
			}
		);

		if (doc) {
			return this.createUserEntity(doc.toObject());
		}
	}

	async detachTruck(truck) {
		const { User } = this.models;

		await User.findByIdAndUpdate(truck.driver.id, { $unset: { truck: "" } });

		return true;
	}

	async updateOrderedQuantityOnTruckAttachedToDriver(order) {
		const driver = order.driver;

		const updates = { $inc: { "truck.quantity": order.quantity } };

		return await this.updateUserById(driver.id, updates);
	}

	async updateProductPriceOnTruckAttachedToDriver(
		newPrice,
		product,
		peddlerId
	) {
		const { User } = this.models;

		const updates = {};

		if (newPrice) {
			for (key in newPrice) {
				updates["truck.productPrice." + key] = newPrice[key];
			}
		}

		return await User.updateMany(
			{ $and: [{ peddler: peddlerId }, { "truck.productId": product.id }] },
			updates
		);
	}

	async detachTruckFromOtherDriversButOne(truckEnt) {
		const { User } = this.models;

		await User.updateMany(
			{
				$and: [
					{ _id: { $ne: truckEnt.driver.id } },
					{ "truck.truckId": truckEnt.id },
				],
			},
			{ $unset: { truck: "" } }
		);

		return true;
	}

	createUserEntity(obj) {
		let entity;
		if (obj.type === types.DRIVER) {
			if (obj.truck) {
				const truckObj = obj.truck
				if (
					isType("object", truckObj.truckId)
					&& !isObjectId(truckObj.truckId)
				) {
					const truckEnt = this.createTruckEntity(truckObj.truckId)
					const productEnt = this.createProductEnt(truckObj.productId)
					truckEnt.product = {
						...truckObj.productPrice,
						quantity: undefined,
						product: productEnt,
						id: productEnt.id
					}
					obj.truck = truckEnt
				}
			}
			entity = this._toEntity(obj, DriverEnt, this._toEntityTransform);
		} else {
			if (obj.type === types.PEDDLER) {
				entity = this._toEntity(obj, PeddlerEnt, this._toEntityTransform);
			} else {
				if (obj.type === types.BUYER) {
					entity = this._toEntity(obj, BuyerEnt, this._toEntityTransform);
				} else {
					entity = this._toEntity(obj, UserEnt, this._toEntityTransform);
				}
			}
		}

		return entity;
	}

	createTruckEntity(obj) {
		return new TruckEnt(obj)
	}

	createProductEnt(obj) {
		return this._toEntity(obj, ProductEnt, { _id: "id" })
	}
};
