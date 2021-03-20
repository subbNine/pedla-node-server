const isType = require("../../lib/utils/is-type");
const User = require("./user");
const { buyerTypes } = require("../../db/mongo/enums/user");

module.exports = class Buyer extends User {
	corporateBuyerCacImg;
	buyerType = buyerTypes.REGULAR;

	constructor(fields = {}) {
		super();
		for (let key in fields) {
			this[key] = fields[key];
		}
	}

	toDto() {
		const dto = super.toDto();

		dto.cacUrl =
			(isType("object", this.corporateBuyerCacImg) &&
				this.corporateBuyerCacImg.uri) ||
			this.corporateBuyerCacImg ||
			null;
		dto.buyerType = ("" + this.buyerType).toLowerCase();

		return dto;
	}
};
