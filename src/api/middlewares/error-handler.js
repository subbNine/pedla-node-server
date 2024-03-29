const errors = require("../../errors");

/***
 * handle errors thrown within the app
 * @param {object} err - error object
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next callback
 */
module.exports = function errorMiddleware(err, req, res, next) {
	const { password, ...rest } = req.body;
	const inputParams = { body: rest, query: req.query, path: req.params };
	err.inputParams = inputParams;
	return errors.error(err, res);
};
