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

	toDto() {
		return {
			id: this.id || null,
			user: this.user.toDto ? this.user.toDto() : this.user || null,
			createdAt: this.createdAt || null,
		};
	}

	generateOtpToken(options) {
		const otpSecret = this.otpSecret;
		if (otpSecret) {
			const otpToken = generateOtpToken(otpSecret, options);
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
