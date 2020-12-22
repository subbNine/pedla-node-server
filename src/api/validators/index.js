const JoiValidator = require("./Joi");
const authSchemas = require("./auth");
const otpSchemas = require("./otp");
const usersSchema = require("./user");

module.exports = {
	postEmailAndPassword: (payload) =>
		JoiValidator(payload, authSchemas.postEmailAndPassword),
	postUsernameAndPassword: (payload) =>
		JoiValidator(payload, authSchemas.postUsernameAndPassword),
	postPeddlerProfile: (payload) =>
		JoiValidator(payload, authSchemas.postPeddlerProfile),
	buyerSignup: (payload) => JoiValidator(payload, authSchemas.buyerSignup),
	postPeddlerCode: (payload) =>
		JoiValidator(payload, authSchemas.postPeddlerCode),
	otpToken: (payload) => JoiValidator(payload, otpSchemas.otpToken),
	postProduct: (payload) => JoiValidator(payload, usersSchema.postProduct),
	productId: (payload) => JoiValidator(payload, usersSchema.productId),
	postPeddlerProduct: (payload) =>
		JoiValidator(payload, usersSchema.postPeddlerProduct),
	postDriver: (payload) => JoiValidator(payload, usersSchema.postDriver),
	postTruck: (payload) => JoiValidator(payload, usersSchema.postTruck),
	postTruckAndDriver: (payload) =>
		JoiValidator(payload, usersSchema.postTruckAndDriver),
	latlon: (payload) => JoiValidator(payload, usersSchema.latlon),
	postOrder: (payload) => JoiValidator(payload, usersSchema.postOrder),
	orderReason: (payload) => JoiValidator(payload, usersSchema.orderReason),
	search: (payload) => JoiValidator(payload, usersSchema.search),
	postRating: (payload) => JoiValidator(payload, usersSchema.rating),
	notification: (payload) => JoiValidator(payload, usersSchema.notification),
};
