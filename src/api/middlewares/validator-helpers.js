/***
 * calls the wrapped validator on input data
 * @param {object} data - input object from request: params | query | body
 * @param {function} validator - validator to validate request: params | query | body
 * @param {function} next - next callback
 **/
function validate(data, validator, next) {
	const err = validator(data);
	if (err && (err.name || err.statusCode || err.message)) {
		const error = new Error(err.message);
		error.name = err.name;
		error.statusCode = err.statusCode;
		next(err);
	} else {
		next();
	}
}

/***
 * request body validator
 * @function
 * @param {function} reqValidator - request validator
 */
function validateBody(reqValidator) {
	return function (req, res, next) {
		const input = req.body;
		return validate(input, reqValidator, next);
	};
}

/***
 * request params validator
 * @function
 * @param {function} reqValidator - request validator
 */
function validateParams(reqValidator) {
	return function (req, res, next) {
		const input = req.params;
		return validate(input, reqValidator, next);
	};
}

/***
 * request query validator
 * @function
 * @param {function} reqValidator - request validator
 */
function validateQuery(reqValidator) {
	return function (req, res, next) {
		const input = req.query;
		return validate(input, reqValidator, next);
	};
}

module.exports = {
	validateQuery,
	validateParams,
	validateBody,
};
