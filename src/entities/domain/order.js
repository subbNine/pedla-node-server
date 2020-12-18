const ProductEnt = require("./product");
const UserEnt = require("./user");
const isType = require("../../lib/utils/is-type");

module.exports = class Order {
	id;
	driver = new UserEnt();
	buyer = new UserEnt();
	product = new ProductEnt();
	quantity;
	unitAmount;
	rating;
	amount;
	status;
	driverLatlon;
	buyerLatLon;
	deliveryAddress;

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
			driver:
				(this.driver && this.driver.repr && this.driver.repr()) ||
				this.driver ||
				null,
			buyer:
				(this.buyer && this.buyer.repr && this.buyer.repr()) ||
				this.buyer ||
				null,
			quantity: this.quantity || null,
			unitAmount: this.unitAmount || null,
			product:
				(this.product && this.product.repr && this.product.repr()) ||
				this.product ||
				null,
			rating: this.rating || null,
			amount: this.amount || null,
			status: this.status || null,
			driverLatlon:
				this.driverLatlon && this.driverLatlon.coordinates
					? {
							lon: this.driverLatlon.coordinates[0],
							lat: this.driverLatlon.coordinates[1],
					  }
					: null,
			buyerLatlon:
				this.buyerLatlon && this.buyerLatlon.coordinates
					? {
							lon: this.buyerLatlon.coordinates[0],
							lat: this.buyerLatlon.coordinates[1],
					  }
					: null,
			deliveryAddress: this.deliveryAddress,
		};
	}
};