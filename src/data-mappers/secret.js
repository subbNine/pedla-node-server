const BaseMapper = require("./base");
const { SecretEnt, UserEnt } = require("../entities/domain");

module.exports = class SecretMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findSecret(otpFilter, populateFn) {
		const { Secret } = this.models;

		const doc = Secret.findOne(otpFilter);
		if (populateFn) {
			populateFn(doc);
		}

		const result = await doc;
		if (result) {
			const secretEnt = this.toEntityObj(result);
			return secretEnt;
		}
	}

	toEntityObj(doc) {
		const resultObj = doc.toObject();
		let userEnt;

		if (resultObj.userId && resultObj.userId._id) {
			const userObj = resultObj.userId;
			userEnt = this._toEntity(userObj, UserEnt, {
				_id: "id",
				streetAddress: "address",
			});
		} else {
			const id = resultObj.userId;
			userEnt = this._toEntity({ id }, UserEnt);
		}

		const secretEnt = this._toEntity(
			{
				id: resultObj._id,
				otpSecret: resultObj.secret,
				user: userEnt,
			},
			SecretEnt
		);

		return secretEnt;
	}

	async createSecret(secretEnt) {
		const { Secret } = this.models;

		const newSecret = {
			secret: secretEnt.otpSecret,
			userId: secretEnt.user.id,
		};

		const doc = await Secret.create(newSecret);
		if (doc) {
			secretEnt.id = doc._id;
			secretEnt.createdAt = doc.createdAt;

			return secretEnt;
		}
	}
};
