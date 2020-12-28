const errors = require("../../errors");

/***
 * handle errors thrown within the app
 * @param {object} err - error object
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next callback
 */
module.exports = function errorMiddleware(err, req, res, next) {
	return errors.error(err, res);
};
