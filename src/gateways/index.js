const smsGateway = require("./sms");
const emailGateway = require("./email");
const pubSub = require("./pubsub");

module.exports = {
	sms: smsGateway,
	email: emailGateway,
	pubSub,
};
