const errors = require("../../errors");

module.exports = (messageObject) => {
	const { pubSubBroker } = require("../../gateways");

	try {
		pubSubBroker.send(messageObject);
	} catch (err) {
		errors.error(err);
	}
};
