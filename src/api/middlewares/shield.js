const lib = require("../../lib");

const errors = lib.error;
const AppError = errors.AppError;
const errorCodes = errors.errorCodes;

module.exports = function sheild(permission) {
	return function (req, res, next) {
		const _App = req._App;
		const user = _App.user;
		const isLoggedIn = _App.isLoggedIn;

		if (!isLoggedIn) {
			throw new AppError({
				name: errorCodes.BadRequestError.name,
				statusCode: errorCodes.BadRequestError.statusCode,
				message: errors.messages.notAuthenticated,
			});
		} else {
			const isAuthorizedUser =
				isLoggedIn && isPermitted(user.permission, permission);

			if (isAuthorizedUser) {
				return next();
			} else {
				throw new AppError({
					name: errorCodes.NotAuthorizedError.name,
					statusCode: errorCodes.NotAuthorizedError.statusCode,
					message: errors.messages.notAuthorized,
				});
			}
		}
	};
};

function isPermitted(userPermission, permission) {
	const isAllowed = isNumber(permission)
		? userPermission >= permission
		: true;

	return isAllowed;
}

function isNumber(num) {
	return num === 0 || (num && !isNaN(num * num));
}
