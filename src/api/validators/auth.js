/**
 * This module contains schemas to validate requests payload
 * specific to users operation
 */
const Joi = require("joi");

module.exports.postEmailAndPassword = Joi.object().keys({
	password: Joi.string().required(),
	email: Joi.string().email().required(),
});

module.exports.postUsernameAndPassword = Joi.object().keys({
	password: Joi.string().required(),
	userName: Joi.string().required(),
});

module.exports.postPeddlerProfile = Joi.object().keys({
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email().lowercase(),
	phoneNumber: Joi.string().min(11).max(15),
	nTrucks: Joi.number(),
});

module.exports.buyerSignup = Joi.object().keys({
	firstName: Joi.string(),
	lastName: Joi.string(),
	email: Joi.string().email().lowercase().required(),
	phoneNumber: Joi.string().min(11).max(15),
	password: Joi.string().required(),
	address: Joi.string(),
});

module.exports.postPeddlerCode = Joi.object().keys({
	code: Joi.string().required(),
});
