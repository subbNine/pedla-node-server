const BaseMapper = require("./base");
const {
	PeddlerProductEnt,
	UserEnt,
	ProductEnt,
} = require("../entities/domain");

module.exports = class UserMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findProduct(filter) {
		const { PeddlerProduct } = this.models;

		const doc = await PeddlerProduct.findOne(
			this.toPeddlerProductPersistence(filter)
		)
			// .populate("peddlerId")
			.populate("productId");

		if (doc) {
			const docObj = doc.toObject();
			const peddler = docObj.peddlerId;
			const product = this.toProductEntity(docObj.productId);
			const result = this.toPeddlerProductEntity(
				Object.assign(docObj, { peddler, product })
			);

			return result;
		}
	}

	async findProducts(filterEnt) {
		const { PeddlerProduct } = this.models;

		const docs = await PeddlerProduct.find(
			this.toPeddlerProductPersistence(filterEnt)
		)
			// .populate("peddlerId")
			.populate("productId");

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const docObj = doc.toObject();
				const peddler = docObj.peddlerId;
				const product = this.toProductEntity(docObj.productId);
				results.push(
					this.toPeddlerProductEntity(
						Object.assign(docObj, { peddler, product })
					)
				);
			}

			return results;
		}
	}

	async createProduct(peddlerProductEnt) {
		const { PeddlerProduct } = this.models;

		const newProduct = this.toPeddlerProductPersistence(peddlerProductEnt);

		const doc = await PeddlerProduct.create(newProduct);

		if (doc) {
			return this.toPeddlerProductEntity(
				doc.toObject(),
				PeddlerProductEnt
			);
		}
	}

	async updateProductById(id, peddlerProductEnt) {
		const { PeddlerProduct } = this.models;

		const update = this.toPeddlerProductPersistence(peddlerProductEnt);

		const doc = await PeddlerProduct.findByIdAndUpdate(id, update, {
			new: true,
		}).populate("productId");
		// .populate("peddlerId");

		if (doc) {
			const docObj = doc.toObject();
			const peddler = docObj.peddlerId;
			const product = this.toProductEntity(docObj.productId);

			return this.toPeddlerProductEntity(
				Object.assign(docObj, { peddler, product })
			);
		}
	}

	toPeddlerEntity(doc) {
		return this._toEntity(doc, UserEnt, {
			streetAddress: "address",
			_id: "id",
		});
	}

	toPeddlerProductEntity(doc) {
		return this._toEntity(doc, PeddlerProductEnt, {
			_id: "id",
			peddlerId: "peddler",
			productId: "product",
		});
	}

	toProductEntity(doc) {
		return this._toEntity(doc, ProductEnt, {
			_id: "id",
		});
	}

	toPeddlerProductPersistence(ent) {
		return this._toPersistence(ent, {
			peddler: "peddlerId",
			product: "productId",
		});
	}
};
