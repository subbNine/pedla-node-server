const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

function createAndSendOtp(userEnt) {
	const services = require("../../services");

	console.log({ userEnt });
	services.secret
		.initSecretsStore(userEnt.id)
		.then(getOtpFromResult)
		.then(send.bind(null, userEnt));
}

function getOtpFromResult(result) {
	if (result.isSuccess) {
		const valueObj = result.getValue();
		const otpToken = valueObj.otpToken;

		return otpToken;
	}
}

function send(userEnt, otpToken) {
	// const smsService = new SmsService();
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	emailService.send({
		from: '"Adekunle From Peddler" <info@peddler.com>',
		to: userEnt.email,
		subject: "Otp Verification",
		text:
			"Hello Here is your otp token:" +
			" " +
			otpToken +
			" " +
			"This token is valid for 6 mins",
	});
}

function normalizePhoneNumber(phoneNumber) {
	const number = phoneUtil.parseAndKeepRawInput(phoneNumber, "NG");
	return phoneUtil.format(number, PNF.E164);
}

module.exports = createAndSendOtp;
