const User = require("./user");

class Driver extends User {
	userName;
	peddler;
	truck;
	orderStats;
	rating;
	peddlerCode;

	constructor(fields) {
		super();
		for (let key in fields) {
			this[key] = fields[key];
		}
	}

	toDto() {
		const dto = super.toDto();
		const orderStats = this.orderStats

		const nOrders = orderStats && orderStats.nOrders || 0
		const nCancelled = orderStats && orderStats.nCancelled || 0
		const nComplete = orderStats && orderStats.nCompleted || 0
		const totalRating = this.rating && this.rating.totalRating || 0.0
		const ratingCount = this.rating && this.rating.ratingCount || 1.0

		const driverStats = {
			nCancelled,
			nComplete,
			percAcceptance: (nComplete / 100) * nOrders,
			perCancelled: (nCancelled / 100) * nOrders,
			rating: totalRating / ratingCount
		}

		dto.peddler =
			(this.peddler && this.peddler.toDto
				? this.peddler.toDto()
				: this.peddler) || null;
		dto.driverStats = driverStats;
		dto.peddlerCode = this.peddlerCode || null;
		dto.userName = this.userName || null;
		dto.truck = (this.truck && this.truck.toDto
			? this.truck.toDto()
			: this.truck) || null;

		return dto;
	}
}

module.exports = Driver;
