const errors = require("../../errors");

/***
 * handle errors thrown within the app
 * @param {object} err - error object
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next callback
 */
module.exports = function errorMiddleware(err, req, res, next) {
	console.log(err)
	err.statusCode =
		err.statusCode || errors.errorCodes.InternalServerError.statusCode;
	err.message = err.message || "internal server error";
	err.name = err.name || errors.errorCodes.InternalServerError.name;
	return errors.error(err, res);
};
