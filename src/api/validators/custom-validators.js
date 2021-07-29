const Joi = require("joi");
const { Types } = require("mongoose");

/***
 * cast value to mongo object id
 */
const toObjectId = Types.ObjectId;

/**
 *
 * @param {any} value
 * @param {object} Joi helpers
 */
function mongooseId(_, value, state, options) {
	let mid;
	try {
		mid = toObjectId(value);
	} catch (error) {
		return this.createError("string.mongoId", {}, state, options);
	}

	return mid;
}

const validator = Joi.extend((Joi) => {
	return {
		name: "string",
		base: Joi.string(),
		rules: [{ name: "mongoId", validate: mongooseId }],
		language: {
			mongoId: "is not a valid Object id",
		},
	};
});

module.exports = validator;
