const BaseError = require("./base_error");
const error_codes = require("./eror_codes");

module.exports = class AppError extends BaseError {
	constructor({
		name = error_codes.InternalServerError.name,
		statusCode,
		message = "internal server error",
		isOperational = true,
		...rest
	}) {
		super({ name, statusCode, message, isOperational, ...rest });
	}
};
