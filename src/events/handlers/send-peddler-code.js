const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

module.exports = function (userEnt) {
	const services = require("../../services");

	console.log({ userEnt });
	services.secret
		.initSecretsStore(userEnt.id)
		.then(getTokenFromResult)
		.then(updatePeddlerProfileWithGeneratedCode.bind(this, userEnt))
		.then((res) => {
			const peddlerCode = res.getValue().peddlerCode;
			sendPeddlerCode(peddlerCode, userEnt);
		});
};

function getTokenFromResult(result) {
	if (result.isSuccess) {
		const valueObj = result.getValue();
		const otpToken = valueObj.otpToken;

		return otpToken;
	}
}

function updatePeddlerProfileWithGeneratedCode(userEnt, token) {
	const services = require("../../services");

	userEnt.peddlerCode = "PED-" + token;
	return services.user.updateProfile(userEnt);
}

function sendPeddlerCode(peddlerCode, userEnt) {
	// const smsService = new SmsService();
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	emailService.send({
		from: '"Adekunle From Peddler" <pedlaapp20@gmail.com>',
		to: userEnt.email,
		subject: "Profile Approved",
		text:
			"Your Profile has been approved and your Peddler code is" +
			" " +
			peddlerCode +
			" " +
			"Signup using this code on your peddler app",
	});
}
