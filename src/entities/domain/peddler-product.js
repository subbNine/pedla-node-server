module.exports = class PeddlerProduct {
	id;
	peddler;
	product;
	residentialAmt;
	commercialAmt;
	commercialOnCrAmt;
	quantity;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key] || fields[key] === 0) {
				this[key] = fields[key];
			}
		}
	}

	toDto() {
		return {
			id: this.id || null,
			peddler:
				this.peddler && this.peddler.toDto
					? this.peddler.toDto()
					: this.peddler || null,
			product:
				this.product && this.product.toDto
					? this.product.toDto()
					: this.product || null,
			residentialAmt: this.residentialAmt || null,
			commercialAmt: this.commercialAmt || null,
			commercialOnCrAmt: this.commercialOnCrAmt || null,
			quantity: this.quantity || null,
		};
	}
};
