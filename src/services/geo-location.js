const { GeoEnt } = require("../entities/domain");
const { utils } = require("../lib");

const { Result } = utils;

module.exports = class GeoLoc {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	getNearestPeddlers() {}

	async updateGeoLocation(geoDto) {
		const { geoMapper } = this.mappers;
		const geoEnt = new GeoEnt(geoDto);

		let updatedLoc = await geoMapper.updateGeoLocation(geoEnt.id, geoEnt);

		if (updatedLoc) {
			return Result.ok({ success: true });
		}
	}
};
