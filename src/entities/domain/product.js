module.exports = class Product {
	id;
	name;
	description;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	repr() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
		};
	}
};
