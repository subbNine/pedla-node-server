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
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	repr() {
		return {
			id: this.id,
			peddler:
				this.peddler && this.peddler.repr
					? this.peddler.repr()
					: this.peddler,
			product:
				this.product && this.product.repr
					? this.product.repr()
					: this.product,
			residentialAmt: this.residentialAmt,
			commercialAmt: this.commercialAmt,
			commercialOnCrAmt: this.commercialOnCrAmt,
			quantity: this.quantity,
		};
	}
};
