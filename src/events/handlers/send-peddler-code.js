const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");

module.exports = function (userEnt) {
	const services = require("../../services");

	console.log({ userEnt });
	services.secret
		.initSecretsStore(userEnt.id)
		.then(getTokenFromResult)
		.then(updatePeddlerProfileWithGeneratedCode.bind(this, userEnt))
		.then((res) => {
			const peddlerCode = res.getValue().peddlerCode;
			sendPeddlerCode(peddlerCode);
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

function sendPeddlerCode(peddlerCode) {
	const smsService = new SmsService();
	const emailService = new EmailService();

	smsService.send(peddlerCode);
	emailService.send(peddlerCode);
}
