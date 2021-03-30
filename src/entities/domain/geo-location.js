module.exports = class User {
	id;
	latlon;
	userId;
	radius;
	METERS_PER_MILE = 1609.34;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	getLat() {
		if (this.latlon) {
			return this.latlon.coordinates[1];
		}
	}

	getLon() {
		if (this.latlon) {
			return this.latlon.coordinates[0];
		}
	}

	// object representation of the domain entity.
	toDto() {
		const dto = {};

		if (this.id) {
			dto.id = this.id;
		}

		if (this.latlon) {
			objectRep.latlon = this.latlon;
		}

		return dto;
	}
};
