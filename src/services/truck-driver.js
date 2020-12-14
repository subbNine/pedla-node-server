const { utils, error } = require("../lib");
const { TruckDriverEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class TruckDriver {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async assignTruckToDriver (truckDriverDto){
		
	}
};
