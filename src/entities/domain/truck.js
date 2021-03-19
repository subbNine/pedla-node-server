const PeddlerProductEnt = require("./peddler-product");
const UserEnt = require("./user");
const isType = require("../../lib/utils/is-type");

module.exports = class Truck {
	id;
	owner = new UserEnt();
	model;
	brand;
	product = new PeddlerProductEnt();
	size;
	license;
	insurance;
	worthiness;
	ownership;
	driver;
	isDeleted;
	quantity;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	toDto() {
		return {
			id: this.id || null,
			owner:
				(this.owner && this.owner.toDto && this.owner.toDto()) ||
				this.owner ||
				null,
			model: this.model || null,
			brand: this.brand || null,
			product:
				(this.product && this.product.toDto && this.product.toDto()) ||
				this.product ||
				null,
			size: this.size || null,
			license:
				(isType("object", this.license) && this.license.uri) ||
				this.license ||
				null,
			insurance:
				(isType("object", this.insurance) && this.insurance.uri) ||
				this.insurance ||
				null,
			worthiness:
				(isType("object", this.worthiness) && this.worthiness.uri) ||
				this.worthiness ||
				null,
			ownership:
				(isType("object", this.ownership) && this.ownership.uri) ||
				this.ownership ||
				null,
			driver:
				(this.driver && this.driver.toDto && this.driver.toDto()) ||
				this.driver ||
				null,
			quantity: this.quantity || 0,
		};
	}
};
