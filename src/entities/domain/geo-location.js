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
			return this.latlon.coordinates[0];
		}
	}

	getLon() {
		if (this.latlon) {
			return this.latlon.coordinates[1];
		}
	}

	// object representation of the domain entity.
	repr() {
		const objectRepr = {};

		if (this.id) {
			objectRepr.id = this.id;
		}

		if (this.latlon) {
			objectRep.latlon = this.latlon;
		}

		return objectRepr;
	}
};
