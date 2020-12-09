const smsGateway = require("./sms");
const emailGateway = require("./email");

module.exports = {
	sms: smsGateway,
	email: emailGateway,
};
