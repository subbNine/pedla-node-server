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
	const smsService = new SmsService();
	const emailService = new EmailService();

	smsService.send(otpToken);
	emailService.send(otpToken);
}

module.exports = createAndSendOtp;
