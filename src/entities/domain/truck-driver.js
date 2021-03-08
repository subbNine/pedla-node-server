const TruckEnt = require("./truck");
const UserEnt = require("./user");

module.exports = class TruckAndDriver {
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

	toDto() {
		return {
			id: this.id || null,
			truck: this.truck || null,
			driver: this.driver || null,
		};
	}

	hasBeenAssignedTruck(truckAndDriverEnt) {
		return (
			String(truckAndDriverEnt.driver.id) == String(this.driver.id) &&
			String(truckAndDriverEnt.truck.id) == String(this.truck.id)
		);
	}
};
