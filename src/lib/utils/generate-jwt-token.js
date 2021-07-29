const { sign } = require("jsonwebtoken");

const { jwtTokenSecret } = require("../../config");

module.exports = function generateToken(data, ttl) {
	const TOKEN_SECRET = jwtTokenSecret;

	let token;
	if (ttl) {
		token = sign({ ...data }, TOKEN_SECRET, { expiresIn: ttl });
	} else {
		token = sign({ ...data }, TOKEN_SECRET);
	}
	return token;
};
