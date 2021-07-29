const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

module.exports = function (userEnt) {
	const services = require("../../services");

	services.secret
		.initSecretsStore(userEnt.id, { step: 10 * 60, digits: 7 })
		.then(getTokenFromResult)
		.then(updateUserProfileWithGeneratedCode.bind(this, userEnt))
		.then(() => {
			sendPasswordResetCode(userEnt.passwordResetCode, userEnt);
		});
};

function getTokenFromResult(result) {
	if (result.isSuccess) {
		const valueObj = result.getValue();
		const passwordResetCode = valueObj.otpToken;

		return passwordResetCode;
	}
}

function updateUserProfileWithGeneratedCode(userEnt, token) {
	const services = require("../../services");

	userEnt.passwordResetCode = "" + token;
	return services.user.updateProfile(userEnt);
}

function sendPasswordResetCode(passwordResetCode, userEnt) {
	// const smsService = new SmsService();
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	emailService.send({
		from: "Adekunle From Peddler <pedlaapp20@gmail.com>",
		to: userEnt.email,
		subject: "Password Recovery",
		text:
			"Use this code to reset your password:" + " " + passwordResetCode + " ",
	});
}
