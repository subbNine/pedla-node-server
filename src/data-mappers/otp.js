const BaseMapper = require("./base");
const { OtpEnt, UserEnt } = require("../entities/domain");

module.exports = class OtpMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findOtp(otpFilter, populateFn) {
		const { Otp } = this.models;

		const doc = Otp.findOne(otpFilter);
		if (populateFn) {
			populateFn(doc);
		}

		const result = await doc;
		if (result) {
			const otpEnt = this.toEntityObj(result);
			return otpEnt;
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

		const otpEnt = this._toEntity(
			{
				id: resultObj._id,
				otpSecret: resultObj.secret,
				user: userEnt,
			},
			OtpEnt
		);

		return otpEnt;
	}

	async createOtp(otpEnt) {
		const { Otp } = this.models;

		const newOtp = {
			secret: otpEnt.otpSecret,
			userId: otpEnt.user.id,
		};

		const doc = await Otp.create(newOtp);
		if (doc) {
			otpEnt.id = doc._id;
			otpEnt.createdAt = doc.createdAt;

			return otpEnt;
		}
	}
};
