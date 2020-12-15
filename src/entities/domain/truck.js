const ProductEnt = require("./product");
const UserEnt = require("./user");

module.exports = class Truck {
	id;
	owner = new UserEnt();
	model;
	brand;
	product = new ProductEnt();
	size;
	license;
	insurance;
	worthiness;
	ownership;
	driver;

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
			owner: (this.owner && this.owner.repr()) || null,
			model: this.model || null,
			brand: this.brand || null,
			product: (this.product && this.product.repr()) || null,
			size: this.size || null,
			license: this.license || null,
			insurance: this.insurance || null,
			worthiness: this.worthiness || null,
			ownership: this.ownership || null,
			driver: this.driver || null,
		};
	}
};
