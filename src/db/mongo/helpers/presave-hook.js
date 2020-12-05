const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;

module.exports = function (next) {
	const user = this;

	if (!user.isModified("password")) {
		return next();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
};
