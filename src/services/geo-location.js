const { UserEnt } = require("../entities/domain");
const { utils, error } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result, generateJwtToken } = utils;

module.exports = class GeoLocation {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	getNearestPeddlers() {}

	updateGeoLocation() {}
};
