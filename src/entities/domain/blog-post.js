module.exports = class BlogPost {
	title;
	body;
	image;
	createdAt;
	updatedAt;
	product;
	id;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	// object representation of the domain entity.
	toDto() {
		const objectRepr = {
			id: this.id || null,
			title: this.title || null,
			body: this.body || null,
			image: (this.image && this.image.uri) || null,
			createdAt: this.createdAt || null,
			product:
				(this.product && this.product.toDto
					? this.product.toDto()
					: this.product) || null,
		};

		return objectRepr;
	}
};
