const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

module.exports = function (userEnt) {
	sendRejectionMsg(userEnt);
};

function sendRejectionMsg(userEnt) {
	// const smsService = new SmsService();
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	emailService.send({
		from: '"Adekunle From Peddler" <pedlaapp20@gmail.com>',
		to: userEnt.email,
		subject: "Profile Approved",
		text: "Hello, " + userEnt.name + " " + "You Profile was not approved",
	});
}
