const BaseMapper = require("./base");
const { UserEnt } = require("../entities/domain");
const isObjectEmpty = require("../lib/utils/is-object-empty");
const { types } = require("../db/mongo/enums").user;

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

		const search = this._toPersistence(
			filter,
			this._toPersistenceTransform
		);
		const doc = User.findOne(search);
		if (populateFn) {
			populateFn(doc);
		}

		const result = await doc;
		if (result) {
			return this._toEntity(
				result.toObject(),
				UserEnt,
				this._toEntityTransform
			);
		}
	}

	async findPeddlersByVStatus(status) {
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

		const docs = await User.find(search);
		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(
					this._toEntity(
						doc.toObject(),
						UserEnt,
						this._toEntityTransform
					)
				);
			}

			return results;
		}
	}

	async createUser(userEnt) {
		const { User } = this.models;

		const newUser = this._toPersistence(
			userEnt,
			this._toPersistenceTransform
		);

		const doc = await User.create(newUser);
		if (doc) {
			return this._toEntity(
				doc.toObject(),
				UserEnt,
				this._toEntityTransform
			);
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
			return this._toEntity(
				doc.toObject(),
				UserEnt,
				this._toEntityTransform
			);
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
			return this._toEntity(
				doc.toObject(),
				UserEnt,
				this._toEntityTransform
			);
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

		console.log({ doc, matchEmailOrUserName });

		if (doc && !isObjectEmpty(matchEmailOrUserName)) {
			return this._toEntity(
				doc.toObject(),
				UserEnt,
				this._toEntityTransform
			);
		}
	}
};
