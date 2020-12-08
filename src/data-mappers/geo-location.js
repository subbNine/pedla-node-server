const BaseMapper = require("./base");
const { GeoEnt } = require("../entities/domain");

module.exports = class GeoMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async updateGeoLocation(geoId, geoEnt) {
		const { User } = this.models;

		const updates = this._toPersistence(
			geoEnt,
			this._toPersistenceTransform
		);

		const doc = await User.findByIdAndUpdate(geoId, updates, {
			new: true,
		});

		if (doc) {
			return this._toEntity(
				doc.toObject(),
				GeoEnt,
				this._toEntityTransform
			);
		}
	}
};
