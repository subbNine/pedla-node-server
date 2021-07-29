const { totp } = require("otplib");

const { OTP_TOKEN_TTL } = require("../../config");

module.exports = function generateOtpToken(secret, options) {
	const { step, digits } = options || {};

	if (secret) {
		totp.options = { step: step || OTP_TOKEN_TTL, digits: digits || 6 };
		return totp.generate(secret);
	}
	throw new Error("generateOtpToken accepts a secret arg");
};
