const TruckEnt = require("./truck");
const UserEnt = require("./user");

module.exports = class TruckDriver {
	id;
	truck = new TruckEnt();
	driver = new UserEnt();

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
			truck: this.truck || null,
			driver: this.driver || null,
		};
	}

	hasBeenAssignedTruck(truckDriverEnt) {
		return truckDriverEnt.driver.id === this.driver.id;
	}
};
