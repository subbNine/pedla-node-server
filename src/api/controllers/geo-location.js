const BaseController = require("./base");
const { GeoDto } = require("../../entities/dtos");
const { geoLocation: geoService } = require("../../services");

module.exports = class GeoLoc extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async updateGeoLocation(req, res, next) {
		const { lat, lon } = req.body;
		const geoDto = new GeoDto();

		const { user } = req._App;

		const coordinates = [+lon, +lat];
		const latlon = {
			type: "Point",
			coordinates,
		};

		geoDto.id = user.id;
		geoDto.latlon = latlon;

		const result = await geoService.updateGeoLocation(geoDto);
		return this.response(result, res);
	}

	async getNearestOnlinePeddlers(req, res, next) {
		const { lat, lon, radius } = req.query;

		const geoDto = new GeoDto();

		const coordinates = [+lon, +lat];
		const latlon = {
			type: "Point",
			coordinates,
		};

		geoDto.latlon = latlon;
		geoDto.radius = radius;

		const result = await geoService.findNearestOnlinePeddler(geoDto);
		return this.response(result, res);
	}
};
