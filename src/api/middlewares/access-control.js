const { AppError, errorCodes, messages } = require("../../errors");

function bounceNonBuyers(req, res, next) {
	const { user } = req._App;
	if (!user || !user.isBuyer()) {
		throw new AppError({
			name: errorCodes.NotAuthorizedError.name,
			statusCode: errorCodes.NotAuthorizedError.statusCode,
			message: messages.notAuthorized,
		});
	} else {
		next();
	}
}

function bounceNonAdmins(req, res, next) {
	const { user } = req._App;
	if (!user || !user.isAdmin()) {
		throw new AppError({
			name: errorCodes.NotAuthorizedError.name,
			statusCode: errorCodes.NotAuthorizedError.statusCode,
			message: messages.notAuthorized,
		});
	} else {
		next();
	}
}

function bounceNonPeddlers(req, res, next) {
	const { user } = req._App;
	if (!user || !user.isPeddler()) {
		throw new AppError({
			name: errorCodes.NotAuthorizedError.name,
			statusCode: errorCodes.NotAuthorizedError.statusCode,
			message: messages.notAuthorized,
		});
	} else {
		next();
	}
}

module.exports = {
	bounceNonPeddlers,
	bounceNonAdmins,
	bounceNonBuyers,
};
