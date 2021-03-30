const BaseMapper = require("./base");
const {
	GeoEnt,
	UserEnt,
	DriverEnt,
	BuyerEnt,
	PeddlerEnt,
	TruckEnt,
	ProductEnt,
	PeddlerProductEnt
} = require("../entities/domain");
const { types } = require("../db/mongo/enums/user");
const { isObjectId, isType } = require("../lib/utils");

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
		const query = User.find(filter)
			.populate("peddler")
			.populate("truck.truckId")
			.populate("truck.productId");;

		if (limit && +limit) {
			query.limit(+limit);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const entObj = doc.toObject();

				results.push(
					this.createUserEntity(entObj)
				);
			}

			return results;
		}
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
					truckEnt.product = this.createPeddlerProductEnt(
						Object.assign(truckObj.productPrice, {
							id: productEnt.id
						}, {
							quantity: undefined,
							product: productEnt
						}))

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
		return this._toEntity(obj, TruckEnt, { productId: "product", _id: "id", ownerId: "owner" })
	}

	createProductEnt(obj) {
		return this._toEntity(obj, ProductEnt, { _id: "id" })
	}

	createPeddlerProductEnt(obj) {
		return this._toEntity(obj,
			PeddlerProductEnt, { _id: "id", productId: "product" }
		)
	}
};
