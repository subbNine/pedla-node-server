const { verify } = require("jsonwebtoken");

const { jwtTokenSecret } = require("../../config");
const { UserEnt } = require("../../entities/domain");

module.exports.httpAuth = function httpAuth(req, _res, next) {
	const token = retreiveTokenFromAuthHeader(req);

	const loggedInUser = decodeToken(token);

	req._App = {};

	if (loggedInUser) {
		const userEnt = new UserEnt(loggedInUser);
		req._App.isLoggedIn = true;
		req._App.user = userEnt;
	}

	return next();
};

function retreiveTokenFromAuthHeader(req) {
	const authHeaderVal = req.get("authorization");
	let token;
	if (("" + authHeaderVal).startsWith("Bearer ")) {
		token = authHeaderVal.slice(7, authHeaderVal.length);
	}

	return token;
}

function decodeToken(token) {
	try {
		const loggedInUser = verify(token, jwtTokenSecret);
		return loggedInUser;
	} catch (err) {
		return;
	}
}
