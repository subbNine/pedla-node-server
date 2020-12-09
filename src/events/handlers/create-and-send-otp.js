const PNF = require("google-libphonenumber").PhoneNumberFormat;
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");

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
	const options = {
		from: "PEDLA",
		to: normalizePhoneNumber(phoneNumber),
		message: `welcome to pedla`,
	};

	const smsService = new SmsService();
	const emailService = new EmailService();

	smsService.send(options);
	emailService.send(options);
}

function normalizePhoneNumber(phoneNumber) {
	const number = phoneUtil.parseAndKeepRawInput(phoneNumber, "NG");
	return phoneUtil.format(number, PNF.E164);
}

module.exports = createAndSendOtp;
