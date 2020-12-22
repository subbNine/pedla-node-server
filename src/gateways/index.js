const smsGateway = require("./sms");
const emailGateway = require("./email");
const pubSubBroker = require("./pubsub-broker");

module.exports = {
	sms: smsGateway,
	email: emailGateway,
	pubSubBroker,
};
