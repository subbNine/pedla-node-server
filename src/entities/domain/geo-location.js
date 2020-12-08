module.exports = class User {
	id;
	latlon;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
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
