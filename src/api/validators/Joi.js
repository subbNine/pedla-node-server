const Joi = require("joi");
const { AppError } = require("../../errors");

let JoiValidator = (payload, schema) => {
	let { error } = Joi.validate(payload, schema, { abortEarly: false });
	if (error) {
		let message = error.details.map((el) => el.message).join("\n");

		return new AppError({
			name: "validationError",
			message: message,
			statusCode: 422,
		});
	}
	return true;
};

module.exports = JoiValidator;
