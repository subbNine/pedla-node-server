const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;
const smsGateway = require("../../gateways").sms;

function createAndSendOtp(userEnt) {
	const services = require("../../services");

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
	const smsService = new SmsService(smsGateway);
	const emailService = new EmailService(emailGateway);

	// smsService.send({
	// 	to: userEnt.phoneNumber,
	// 	message:
	// 		"Hello Here is your otp token:" +
	// 		" " +
	// 		otpToken +
	// 		" " +
	// 		"This token is valid for 6 mins",
	// });

	emailService.send({
		from: "Adekunle From Peddler <pedlaapp20@gmail.com>",
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

module.exports = createAndSendOtp;
