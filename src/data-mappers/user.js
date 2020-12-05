const BaseMapper = require("./base");
const { UserEnt } = require("../entities/domain");

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
};
