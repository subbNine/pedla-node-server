const BaseMapper = require("./base");

const isObjectEmpty = require("../lib/utils/is-object-empty");
const { UserEnt, PeddlerProductEnt, GeoEnt } = require("../entities/domain");
const { presence } = require("../db/mongo/enums/user");
const { types } = require("../db/mongo/enums").user;
const { Types } = require("mongoose");

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
		const doc = User.findOne(search);
		if (populateFn) {
			populateFn(doc);
		}

		const result = await doc;
		if (result) {
			const entObj = result.toObject();
			if (result.avatarImg && result.avatarImg.uri) {
				entObj.avatarImg = result.avatarImg.uri;
			}
			return this._toEntity(entObj, UserEnt, this._toEntityTransform);
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

	async findUsers(filter, options) {
		const { User } = this.models;
		const query = User.find(this._toPersistence(filter));

		const { pagination } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const entObj = doc.toObject();
				if (doc.avatarImg && doc.avatarImg.uri) {
					entObj.avatarImg = doc.avatarImg.uri;
				}
				results.push(this._toEntity(entObj, UserEnt, { _id: "id" }));
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
				results.push(
					this._toEntity(doc.toObject(), UserEnt, this._toEntityTransform)
				);
			}

			return results;
		}
	}

	async createUser(userEnt) {
		const { User } = this.models;

		const newUser = this._toPersistence(userEnt, this._toPersistenceTransform);

		const doc = await User.create(newUser);
		if (doc) {
			console.log({ doc });
			return this._toEntity(doc.toObject(), UserEnt, this._toEntityTransform);
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

		if (doc) {
			return this._toEntity(doc.toObject(), UserEnt, this._toEntityTransform);
		}
	}

	async rejectPeddler(userId) {
		const { User } = this.models;

		const doc = await User.findByIdAndUpdate(
			userId,
			{ isActivePeddler: false },
			{
				new: true,
			}
		);

		if (doc) {
			return this._toEntity(doc.toObject(), UserEnt, this._toEntityTransform);
		}
	}

	async signup(userId, userEntUpdate) {
		const { User } = this.models;

		const foundUser = await User.findById(userId);

		console.log({ foundUser: foundUser.toObject() });

		foundUser.password = userEntUpdate.password;
		foundUser.userName = userEntUpdate.userName;

		const savedDoc = await foundUser.save();

		if (savedDoc) {
			return this._toEntity(
				savedDoc.toObject(),
				UserEnt,
				this._toEntityTransform
			);
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
			return this._toEntity(doc.toObject(), UserEnt, this._toEntityTransform);
		}
	}

	async searchForProductDrivers({ productId, quantity, geo }, options) {
		const { PeddlerProduct } = this.models;

		const { pagination } = options || {};
		const { page, limit } = pagination || {};

		const geoEnt = new GeoEnt(geo);
		const lat = geoEnt.getLat();
		const lon = geoEnt.getLon();
		const radius = geoEnt.radius;

		const radiusIsNum = radius && typeof +radius === "number";
		const METERS_PER_MILE = geoEnt.METERS_PER_MILE;

		const products = await PeddlerProduct.aggregate([
			{
				$match: {
					quantity: { $gt: quantity },
					productId: Types.ObjectId(productId),
				},
			},
			{
				$lookup: {
					from: "users",
					let: { peddId: "$peddlerId" },
					pipeline: [
						{
							$geoNear: {
								near: { type: "Point", coordinates: [+lon, +lat] },
								maxDistance: (radiusIsNum ? +radius : 10) * METERS_PER_MILE,
								key: "latlon",
								distanceField: "dist.calculated",
								spherical: true,
							},
						},
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$peddler", "$$peddId"] },
										{ presence: presence.ONLINE },
									],
								},
							},
						},
					],
					as: "drivers",
				},
			},
			{ $skip: +page },
			{ $limit: +limit },
		]);

		const driversList = [];

		if (products) {
			for (const p of products) {
				const { drivers, ...product } = p;
				if (drivers && drivers.length) {
					for (const driver of drivers) {
						const driverEnt = this._toEntity(driver, UserEnt, {
							streetAddress: "address",
							_id: "id",
						});
						const peddlerProductEnt = this._toEntity(
							product,
							PeddlerProductEnt,
							{
								_id: "id",
								peddlerId: "peddler",
								productId: "product",
							}
						);
						driversList.push(
							Object.assign(
								{},
								{ driver: driverEnt.repr() },
								{ product: peddlerProductEnt.repr() }
							)
						);
					}
				}
			}
		}

		return driversList;
	}
};
