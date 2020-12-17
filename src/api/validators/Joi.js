const Joi = require("joi");

let JoiValidator = (payload, schema) => {
	let { error } = Joi.validate(payload, schema, { abortEarly: false });
	if (error) {
		let message = error.details.map((el) => el.message).join("\n");
		return {
			message,
			name: "ValidationError",
			statusCode: 422,
		};
	}
	return true;
};

module.exports = JoiValidator;
