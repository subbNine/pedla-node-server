const { UserEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, generateJwtToken } = utils;

module.exports = class Order {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	requestPeddlerProduct() {
		throw new Error("Not implemented");
	}

	confirmProductDelivery() {
		throw new Error("Not implemented");
	}

	rateTransaction() {
		throw new Error("Not implemented");
	}
};
