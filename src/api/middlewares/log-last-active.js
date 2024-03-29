const { activity } = require("../../services");

module.exports = async (req, res, next) => {
	const { user } = req._App;

	if (user) {
		activity.logLastActive(user);
	}

	next();
};
