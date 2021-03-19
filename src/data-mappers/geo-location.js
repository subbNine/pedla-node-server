const BaseMapper = require("./base");
const {
	GeoEnt,
	UserEnt,
	DriverEnt,
	BuyerEnt,
	PeddlerEnt,
} = require("../entities/domain");
const { types } = require("../db/mongo/enums/user");

module.exports = class GeoMapper extends BaseMapper {
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

	async updateGeoLocation(geoId, geoEnt) {
		const { User } = this.models;

		const updates = this._toPersistence(geoEnt, this._toPersistenceTransform);

		const doc = await User.findByIdAndUpdate(geoId, updates, {
			new: true,
		});

		if (doc) {
			return this._toEntity(doc.toObject(), GeoEnt, this._toEntityTransform);
		}
	}

	async findUsersByGeoLocation(filter, limit) {
		const { User } = this.models;
		const query = User.find(filter).populate("peddler");

		if (limit && +limit) {
			query.limit(+limit);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const entObj = doc.toObject();
				if (doc.avatarImg && doc.avatarImg.uri) {
					entObj.avatarImg = doc.avatarImg.uri;
				}
				results.push(this.createUserEntity(entObj));
			}

			return results;
		}
	}

	createUserEntity(obj) {
		let entity;
		if (obj.type === types.DRIVER) {
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
};
