module.exports = (messageObject) => {
	const { pubSubBroker } = require("../../gateways");

	pubSubBroker.send(messageObject);
};
