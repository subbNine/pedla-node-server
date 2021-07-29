const errors = require("../../errors");

module.exports = (messageObject) => {
	const { pubSub } = require("../../gateways");

	try {
		pubSub.send(messageObject);
	} catch (err) {
		errors.error(err);
	}
};
