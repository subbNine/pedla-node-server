module.exports = class Product {
	id;
	name;
	description;
	price;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	repr() {
		return {
			id: this.id || null,
			name: this.name || null,
			description: this.description || null,
			price: this.price || null,
		};
	}
};
