const BaseMapper = require("./base");
const {
	PeddlerProductEnt,
	UserEnt,
	ProductEnt,
} = require("../entities/domain");

module.exports = class PeddlerProductMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async findProductBy(product, owner) {
		const { User } = this.models;

		const doc = await User.findOne(
			{
				_id: owner.id,
			},
			{ products: { $elemMatch: { productId: product.id } } }
		);

		if (doc && doc.products && doc.products.length) {
			const docObj = doc.toObject();
			const { products, ...peddler } = docObj;

			products[0].peddler = peddler;

			const peddlerProductEnt = this.toPeddlerProductEntity(products[0]);

			return peddlerProductEnt;
		}
	}

	async findProducts(filter) {
		const { User } = this.models;

		const doc = await User.findById(filter.peddler).populate(
			"products.productId"
		);

		const results = [];
		if (doc && doc.products && doc.products.length) {
			const docObj = doc.toObject();
			const { products, ...peddler } = docObj;

			for (let product of products) {
				const productEnt = this.toProductEntity(product.productId);
				results.push(
					this.toPeddlerProductEntity(
						Object.assign(product, {
							peddler: peddler._id,
							product: productEnt,
						})
					)
				);
			}

			return results;
		}
	}

	async createProduct(peddlerProductEnt) {
		const { User } = this.models;

		const peddlerId = peddlerProductEnt.peddler;
		const productId = peddlerProductEnt.product;
		const residentialAmt = peddlerProductEnt.residentialAmt;
		const commercialAmt = peddlerProductEnt.commercialAmt;
		const commercialOnCrAmt = peddlerProductEnt.commercialOnCrAmt;
		const quantity = peddlerProductEnt.quantity;

		const doc = await User.findOne({ _id: peddlerId });

		if (doc) {
			if (doc.products) {
				const subDoc = doc.products.find(
					(each) => String(each.productId) === String(productId)
				);

				if (subDoc) {
					subDoc.residentialAmt = residentialAmt;
					subDoc.commercialAmt = commercialAmt;
					subDoc.commercialOnCrAmt = commercialOnCrAmt;
					subDoc.quantity = quantity;
				} else {
					doc.products.push({
						productId,
						residentialAmt,
						commercialAmt,
						commercialOnCrAmt,
						quantity,
					});
				}
			} else {
				doc.products = [
					{
						productId,
						residentialAmt,
						commercialAmt,
						commercialOnCrAmt,
						quantity,
					},
				];
			}
			const saved = await doc.save();

			return this.toPeddlerProductEntity(
				saved
					.toObject()
					.products.find((each) => String(each.productId) == String(productId)),
				PeddlerProductEnt
			);
		}
	}

	async updateProductById(id, peddlerProductEnt) {
		const { User } = this.models;

		const updates = this.toPeddlerProductPersistence(peddlerProductEnt);

		const { peddlerId, ...rest } = updates;

		const productUpdates = {};

		if (rest.residentialAmt) {
			productUpdates["products.residentialAmt"] =
				peddlerProductEnt.residentialAmt;
		}

		if (rest.commercialAmt) {
			productUpdates["products.commercialAmt"] =
				peddlerProductEnt.commercialAmt;
		}

		if (rest.commercialOnCrAmt) {
			productUpdates["products.commercialOnCrAmt"] =
				peddlerProductEnt.commercialOnCrAmt;
		}
		if (rest.quantity) {
			productUpdates["products.quantity"] = peddlerProductEnt.quantity;
		}

		const doc = await User.findOneAndUpdate(
			{
				$and: [
					{
						_id: peddlerId,
					},
					{ "products.productId": id },
				],
			},
			productUpdates,
			{
				new: true,
			}
		).populate("products.productId");

		if (doc) {
			const docObj = doc.toObject();
			const { products, ...peddler } = docObj;

			const updatedProductDoc = products.find(
				(each) => String(each._id) == String(id)
			);

			return this.toPeddlerProductEntity(
				Object.assign(
					{ ...updatedProductDoc },
					{ _id: updatedProductDoc.productId._id },
					{ peddler: peddler._id, product }
				)
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
