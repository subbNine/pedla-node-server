const User = require("./user");

module.exports = class Driver extends User {
	userName;
	peddler;
	truck;
	driverStats;

	constructor(fields = {}) {
		super(fields);
	}

	toDto() {
		const dto = super.toDto();

		dto.peddler =
			(this.peddler && this.peddler.toDto
				? this.peddler.toDto()
				: this.peddler) || null;
		dto.driverStats = this.driverStats || null;

		dto.userName = this.userName || null;
		dto.truck = this.truck || null;

		return dto;
	}
};
