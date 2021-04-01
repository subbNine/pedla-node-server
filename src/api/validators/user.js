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
	platform: Joi.string(),
	deviceToken: Joi.string(),
	avatarUrl: Joi.string(),
});

module.exports.postProduct = Joi.object().keys({
	name: Joi.string(),
	description: Joi.string(),
	price: Joi.number(),
});

module.exports.userId = Joi.object().keys({
	userId: mongoIdVal.string().mongoId(),
});

module.exports.productId = Joi.object().keys({
	productId: mongoIdVal.string().mongoId(),
});

module.exports.peddlerId = Joi.object().keys({
	peddlerId: mongoIdVal.string().mongoId(),
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

module.exports.getOrders = Joi.object().keys({
	status: Joi.string().allow(null).allow(""),
	page: Joi.number().min(0),
	limit: Joi.number().min(0),
});

module.exports.pagination = Joi.object().keys({
	page: Joi.number().min(0),
	limit: Joi.number().min(0),
});

module.exports.postTruck = Joi.object().keys({
	productId: mongoIdVal.string().mongoId().allow(null),
	model: Joi.string().allow(null),
	brand: Joi.string().allow(null),
	size: Joi.number().allow(null),
	quantity: Joi.number().min(0).allow(null),
});

module.exports.deleteTruck = Joi.object().keys({
	truckId: mongoIdVal.string().mongoId(),
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
	amount: Joi.number().allow(null).allow(""),
	status: Joi.string(),
	driverLat: Joi.number(),
	driverLon: Joi.number(),
	buyerLat: Joi.number(),
	buyerLon: Joi.number(),
	deliveryAddress: Joi.string(),
	deliveryDate: Joi.string(),
	creditPaymentDate: Joi.string().allow(null).allow(""),
	paymentMethod: Joi.string(),
	priceCategory: Joi.string(),
	invoiceId: Joi.string()
});

module.exports.orderReason = Joi.object().keys({
	reason: Joi.string().required(),
});

module.exports.search = Joi.object().keys({
	lat: Joi.number().required(),
	lon: Joi.number().required(),
	quantity: Joi.number().allow(null),
	page: Joi.number().allow(null),
	limit: Joi.number().allow(null),
	productId: mongoIdVal.string().mongoId().required(),
});

module.exports.rating = Joi.object().keys({
	rating: Joi.number().min(1).max(5),
});

module.exports.notification = Joi.object().keys({
	title: Joi.string(),
	receiverId: mongoIdVal.string().mongoId(),
	message: Joi.string(),
	platform: Joi.string(),
});

module.exports.email = Joi.object().keys({
	email: Joi.string().required(),
});
