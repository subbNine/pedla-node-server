const { GeoEnt } = require("../entities/domain");
const { utils } = require("../lib");
const { types: userTypes, presence } = require("../db/mongo/enums").user;

const { Result } = utils;

module.exports = class GeoLoc {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async findNearestOnlinePeddler(geoDto) {
		const { geoMapper } = this.mappers;

		const geoEnt = new GeoEnt(geoDto);
		const lat = geoEnt.getLat();
		const lon = geoEnt.getLon();
		const radius = geoEnt.radius;

		const latIsNum = lat && typeof +lat === "number";
		const lonIsNum = lon && typeof +lon === "number";
		const radiusIsNum = radius && typeof +radius === "number";

		let peddlers;
		if (latIsNum && lonIsNum) {
			// return all users within five miles in
			// sorted order from nearest to farthest
			const METERS_PER_MILE = geoEnt.METERS_PER_MILE;

			const peddlersWithinMaxDistanceOfPosition = geoMapper.findUsersByGeoLocation(
				{
					$and: [
						{ type: userTypes.DRIVER },
						{ presence: presence.ONLINE },
						{
							latlon: {
								$nearSphere: {
									$geometry: {
										type: "Point",
										coordinates: [+lon, +lat],
									},
									$maxDistance: (radiusIsNum ? +radius : 10) * METERS_PER_MILE,
								},
							},
						},
					],
				}
			);

			const peddlersNearestToPosition = geoMapper.findUsersByGeoLocation(
				{
					$and: [
						{ type: userTypes.DRIVER },
						{ presence: presence.ONLINE },
						{
							latlon: {
								$nearSphere: {
									$geometry: {
										type: "Point",
										coordinates: [+lon, +lat],
									},
								},
							},
						},
					],
				},
				10
			);

			peddlers = await Promise.all([
				peddlersWithinMaxDistanceOfPosition,
				peddlersNearestToPosition,
			]);

			if (peddlers && (peddlers[0] || peddlers[1])) {
				return Result.ok(
					(
						(peddlers[0] && peddlers[0].length && peddlers[0]) ||
						(peddlers[1] && peddlers[1].length && peddlers[1])
					).map((eachUser) => eachUser.repr())
				);
			} else {
				return Result.ok([]);
			}
		}
	}

	async updateGeoLocation(geoDto) {
		const { geoMapper } = this.mappers;
		const geoEnt = new GeoEnt(geoDto);

		let updatedLoc = await geoMapper.updateGeoLocation(geoEnt.id, geoEnt);

		if (updatedLoc) {
			return Result.ok({ success: true });
		}
	}
};
