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

	repr() {
		return {
			id: this.id || null,
			peddler:
				this.peddler && this.peddler.repr
					? this.peddler.repr()
					: this.peddler || null,
			product:
				this.product && this.product.repr
					? this.product.repr()
					: this.product || null,
			residentialAmt: this.residentialAmt || null,
			commercialAmt: this.commercialAmt || null,
			commercialOnCrAmt: this.commercialOnCrAmt || null,
			quantity: this.quantity || null,
		};
	}
};
