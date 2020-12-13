module.exports = class Product {
	id;
	truckNo;
	name;
	owner;

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
			truckNo: this.truckNo || null,
			name: this.name || null,
			owner: this.owner || null,
		};
	}
};
