/**
 * This module contains schemas to validate requests payload
 * specific to users operation
 */
const Joi = require("joi");

const mongoIdVal = require("./custom-validators");

module.exports.postProfileUpdate = Joi.object().keys({
	address: Joi.string(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	phoneNumber: Joi.string(),
});

module.exports.postProduct = Joi.object().keys({
	name: Joi.string(),
	description: Joi.string(),
});

module.exports.userId = Joi.object().keys({
	userId: mongoIdVal.string().mongoId(),
});

module.exports.productId = Joi.object().keys({
	productId: mongoIdVal.string().mongoId(),
});

module.exports.driverId = Joi.object().keys({
	driverId: mongoIdVal.string().mongoId(),
});

module.exports.postPeddlerProduct = Joi.object().keys({
	productId: mongoIdVal.string().mongoId(),
	residentialAmt: Joi.number(),
	commercialAmt: Joi.number(),
	commercialOnCrAmt: Joi.number(),
	quantity: Joi.number(),
});

module.exports.postDriver = Joi.object().keys({
	userName: Joi.string(),
	firstName: Joi.string(),
	lastName: Joi.string(),
	phoneNumber: Joi.string(),
	password: Joi.string(),
	email: Joi.string(),
});

module.exports.postTruck = Joi.object().keys({
	productId: mongoIdVal.string().mongoId(),
	model: Joi.string(),
	brand: Joi.string(),
	size: Joi.number(),
});

module.exports.postTruckAndDriver = Joi.object().keys({
	driverId: mongoIdVal.string().mongoId().required(),
	truckId: mongoIdVal.string().mongoId().required(),
});

module.exports.latlon = Joi.object().keys({
	lat: Joi.number(),
	lon: Joi.number(),
	radius: Joi.number(),
});

module.exports.postOrder = Joi.object().keys({
	driverId: mongoIdVal.string().mongoId().required(),
	buyerId: mongoIdVal.string().mongoId(),
	productId: mongoIdVal.string().mongoId().required(),
	quantity: Joi.number().required(),
	unitAmount: Joi.number().required(),
	rating: Joi.number(),
	amount: Joi.number(),
	status: Joi.string(),
	driverLat: Joi.number(),
	driverLon: Joi.number(),
	buyerLat: Joi.number(),
	buyerLon: Joi.number(),
	deliveryAddress: Joi.string(),
});

module.exports.orderReason = Joi.object().keys({
	reason: Joi.string().required(),
});

module.exports.search = Joi.object().keys({
	lat: Joi.number().required(),
	lon: Joi.number().required(),
	quantity: Joi.number(),
	page: Joi.number(),
	limit: Joi.number(),
	productId: mongoIdVal.string().mongoId().required(),
});
