const isType = require("../../lib/utils/is-type");
const User = require("./user");

module.exports = class Peddler extends User {
	peddlerCode;
	isActivePeddler;
	pooImage;
	nTrucks;
	passwordResetToken;
	passwordResetExpires;
	passwordResetCode;
	products;

	constructor(fields = {}) {
		super();
		for (let key in fields) {
			this[key] = fields[key];
		}
	}

	toDto() {
		const dto = super.toDto();

		dto.peddlerCode = this.peddlerCode || null;
		dto.nTrucks = this.nTrucks || null;

		dto.pooImage =
			(isType("object", this.pooImage) && this.pooImage.uri) ||
			this.pooImage ||
			null;
		dto.userName = this.userName || null;
		dto.isActivePeddler = this.isActivePeddler || null;
		dto.products = this.products || null;

		return dto;
	}
};
