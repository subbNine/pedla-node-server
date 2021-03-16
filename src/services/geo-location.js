const { GeoEnt } = require("../entities/domain");
const { utils } = require("../lib");
const { presence } = require("../db/mongo/enums/user");
const { types: userTypes } = require("../db/mongo/enums").user;

const { Result } = utils;

module.exports = class GeoLoc {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async findNearestOnlineDrivers(geoDto) {
		const { geoMapper } = this.mappers;

		const geoEnt = new GeoEnt(geoDto);
		const lat = geoEnt.getLat();
		const lon = geoEnt.getLon();
		const radius = geoEnt.radius;

		const latIsNum = lat && typeof +lat === "number";
		const lonIsNum = lon && typeof +lon === "number";
		const radiusIsNum = radius && typeof +radius === "number";

		let drivers;
		if (latIsNum && lonIsNum) {
			const METERS_PER_MILE = geoEnt.METERS_PER_MILE;

			const driversWithinMaxDistanceOfPosition = await geoMapper.findUsersByGeoLocation(
				{
					$and: [
						{ type: userTypes.DRIVER },
						{ presence: presence.ONLINE },
						{ truck: { $exists: true } },
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

			if (!driversWithinMaxDistanceOfPosition) {
				const driversNearestToPosition = await geoMapper.findUsersByGeoLocation(
					{
						$and: [
							{ type: userTypes.DRIVER },
							{ presence: presence.ONLINE },
							{ truck: { $exists: true } },
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

				drivers = driversNearestToPosition;
			} else {
				drivers = driversWithinMaxDistanceOfPosition;
			}

			if (drivers) {
				const nearestDrivers =
					drivers &&
					drivers.map((eachDriver) => {
						eachDriver.peddlerCode = eachDriver.peddler.peddlerCode;
						eachDriver.peddler = null;

						return eachDriver.toDto();
					});

				return Result.ok(nearestDrivers);
			}
		}
		return Result.ok([]);
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
