const { utils } = require("../../lib");

const { generateOtpSecret, generateOtpToken } = utils;

module.exports = class Otp {
	user = {};
	otpSecret;
	createdAt;
	id;
	otpToken;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	repr() {
		return {
			id: this.id,
			user: this.user,
			createdAt: this.createdAt,
		};
	}

	generateOtpToken(step) {
		const otpSecret = this.otpSecret;
		if (otpSecret) {
			const otpToken = generateOtpToken(otpSecret, step);
			this.otpToken = otpToken;
		} else {
			throw new Error(
				"secret not set. generate secret by calling generateOtpSecret on the instance of otp entity"
			);
		}
	}

	async generateOtpSecret() {
		this.otpSecret = await generateOtpSecret();
	}
};
