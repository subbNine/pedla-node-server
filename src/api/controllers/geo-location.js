const BaseController = require("./base");

module.exports = class GeoLoc extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	updateGeoLocation(req, res, next) {}
};
