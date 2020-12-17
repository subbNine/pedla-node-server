/**
 * This module contains schemas to validate requests payload
 * specific to users operation
 */
const Joi = require("joi");

module.exports.otpToken = Joi.object().keys({
	otpToken: Joi.string().length(6).required(),
});
