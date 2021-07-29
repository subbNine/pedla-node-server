const bcrypt = require("bcrypt");

module.exports = function (candidatePassword, done) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, (err, matched) => {
			if (err) {
				reject(err);
				if (done) {
					return done(err);
				}
			}

			resolve(matched);
			if (done) {
				return done(null, matched);
			}
		});
	});
};
