module.exports = class BaseError extends Error {
	constructor({ name, statusCode, message, isOperational = true, ...rest }) {
		super(message);

		if (name) {
			this.name = name;
		}
		if (statusCode) {
			this.statusCode = statusCode;
		}
		if (message) {
			this.errMessage = message;
		}
		this.isOperational = isOperational;

		for (let key in rest) {
			this[key] = rest[key];
		}

		Error.captureStackTrace(this, this.constructor);
	}
};
