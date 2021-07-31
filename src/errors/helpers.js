const errorCodes = require("./eror_codes");
const AppError = require("./app_error");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { APP_ENV } = require("../config");

Sentry.init({
	dsn:
		"https://15eb77b294a34b0ba706701e99076341@o499149.ingest.sentry.io/5577371",
	tracesSampleRate: 1.0,
});

function _sendDevError(err, res) {
	const errWithStack = { ...err, stack: err.stack };
	return res
		.status(err.statusCode || errorCodes.InternalServerError.statusCode)
		.json(errWithStack);
}

function _sendProdError(err, res) {
	if (err.isOperational) {
		const { stack, inputParams, ...rest } = err;
		Sentry.captureException(err);
		return res
			.status(err.statusCode || errorCodes.InternalServerError.statusCode)
			.json(rest);
	} else {
		// CRITICAL: log error to sentry
		Sentry.captureException(err);

		if (res) {
			return res.status(errorCodes.InternalServerError.statusCode).json({
				name: errorCodes.InternalServerError.name,
				message: "Sorry an unexpected error has occured",
			});
		}
	}
}

function _handleCastError(err) {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError({
		name: errorCodes.BadRequestError.name,
		statusCode: errorCodes.BadRequestError.statusCode,
		message,
	});
}

function _handleDuplicateFieldsDBError(err) {
	const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError({
		name: errorCodes.BadRequestError.name,
		statusCode: errorCodes.BadRequestError.statusCode,
		message,
	});
}

function _handleValidationsDBError(err) {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError({
		name: errorCodes.BadRequestError.name,
		statusCode: errorCodes.BadRequestError.statusCode,
		message,
	});
}

// A wrapper for route handlers that catches errors
// thrown within these handlers
module.exports.catchAsync = function catchAsync(fn) {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

module.exports.error = function error(err, res) {
	if (APP_ENV === "development") {
		_sendDevError(err, res);
	} else {
		let error = err;

		/* Mongoose Errors */
		if (error.name === "CastError") {
			error = _handleCastError(error);
		}

		if (error.code === 11000) {
			error = _handleDuplicateFieldsDBError(error);
		}

		if (error.name === "ValidationError") {
			error = _handleValidationsDBError(error);
		}
		/* ----------------- */

		_sendProdError(error, res);
	}
};
