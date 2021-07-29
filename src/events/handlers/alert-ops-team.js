const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

function alertOpsTeam(userEnt) {
	sendMessage(userEnt);
}

function sendMessage(userEnt) {
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	if (userEnt.isPeddler()) {
		emailService.send({
			from: "Peddler <pedlaapp20@gmail.com>",
			to: "pedlaapp20@gmail.com",
			subject: "New Peddler Registered",
			text:
				"A new peddler by name" +
				" " +
				userEnt.name +
				" " +
				"has registered, check your dashboard",
		});
	} else {
		if (userEnt.isCorporateBuyer()) {
			emailService.send({
				from: "Peddler <pedlaapp20@gmail.com>",
				to: "pedlaapp20@gmail.com",
				subject: "New Corporate Buyer Registered",
				text:
					"A new Corporate Buyer by name" +
					" " +
					userEnt.name +
					" " +
					"has registered, check your dashboard",
			});
		}
	}
}

module.exports = alertOpsTeam;
