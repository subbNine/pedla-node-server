const error = require("../../errors");

/***
 * handle unregistered routes
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next callback
 **/
module.exports = function invalidRouteMiddleware(req, res, next) {
	const errorCodes = error.errorCodes;
	const AppError = error.AppError;

	const name = errorCodes.ResourceNotFoundError.name;
	const statusCode = errorCodes.ResourceNotFoundError.statusCode;
	const message = `[${req.method ? req.method : ""}] ${
		req.path
	} is not a valid route`;

	const notFoundError = new AppError({ name, statusCode, message });

	return next(notFoundError);
};
