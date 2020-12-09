const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

function alertOpsTeam(userEnt) {
	sendMessage(userEnt);
}

function sendMessage(userEnt) {
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	emailService.send({
		from: '"Peddler" <info@peddler.com>',
		to: "pedlaapp20@gmail.com",
		subject: "New Peddler Registered",
		text:
			"A new peddler by name" +
			" " +
			userEnt.name +
			" " +
			"has registered, check your Admin dashboard",
	});
}

module.exports = alertOpsTeam;
