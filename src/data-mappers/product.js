const BaseMapper = require("./base");
const { ProductEnt } = require("../entities/domain");

module.exports = class UserMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findProducts(filter) {
		const { Product } = this.models;
		const docs = await Product.find(this._toPersistence(filter));
		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(
					this._toEntity(doc.toObject(), ProductEnt, { _id: "id" })
				);
			}

			return results;
		}
	}

	async findProduct(filter) {
		const { Product } = this.models;
		const doc = await Product.findOne(this._toPersistence(filter));

		if (doc) {
			return this._toEntity(doc.toObject(), ProductEnt);
		}
	}

	async createProduct(productEnt) {
		const { Product } = this.models;

		const newProduct = this._toPersistence(productEnt);

		const doc = await Product.create(newProduct);

		if (doc) {
			return this._toEntity(doc.toObject(), ProductEnt);
		}
	}

	async updateProductById(id, productEnt) {
		const { Product } = this.models;

		const updates = this._toPersistence(productEnt);

		const doc = await Product.findByIdAndUpdate(id, updates, { new: true });

		if (doc) {
			return this._toEntity(doc.toObject(), ProductEnt);
		}
	}

	async deleteProduct(id) {
		const { Product } = this.models;

		const doc = await Product.findByIdAndDelete(id);

		if (doc) {
			return this._toEntity(doc.toObject(), ProductEnt);
		}
	}
};
