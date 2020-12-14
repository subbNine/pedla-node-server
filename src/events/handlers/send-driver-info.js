const EmailService = require("../../services/email");
const emailGateway = require("../../gateways").email;

module.exports = function (userEnt) {
	sendRejectionMsg(userEnt);
};

function sendRejectionMsg(userEnt) {
	// const smsService = new SmsService();
	const emailService = new EmailService(emailGateway);

	// smsService.send(peddlerCode);

	// emailService.send({
	// 	from: "Adekunle From Peddler <pedlaapp20@gmail.com>",
	// 	to: userEnt.email,
	// 	subject: "Added As a Driver",
	// 	html:
	// 		"Hello, " +
	// 		'<span style= "text-transform: capitalize; font-weight: bold;">' +
	// 		(userEnt.firstName || "") +
	// 		" " +
	// 		(userEnt.lastName || "") +
	// 		"</span>" +
	// 		" " +
	// 		"You Have just been added as a driver to" +
	// 		" " +
	// 		'<span style="font-weight: bold; text-transform: capitalize;">' +
	// 		(userEnt.peddler.firstName || "") +
	// 		" " +
	// 		(userEnt.peddler.lastName || "") +
	// 		"</span>" +
	// 		"<br> Your Login Credentials are" +
	// 		"<br>" +
	// 		"<b>Username: </b>" +
	// 		userEnt.userName +
	// 		"<br>" +
	// 		"<b>Password: </b>" +
	// 		userEnt.password,
	// });
}
