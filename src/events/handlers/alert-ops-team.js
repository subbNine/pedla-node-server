const SmsService = require("../../services/sms");
const EmailService = require("../../services/email");

function alertOpsTeam(userEnt) {
	sendMessage(userEnt);
}

function sendMessage(userEnt) {
	const smsService = new SmsService();
	const emailService = new EmailService();
	// notify ops team
	console.log("here ops team", userEnt.id);
	smsService.send(userEnt.id);
	emailService.send(userEnt.id);
}

module.exports = alertOpsTeam;
