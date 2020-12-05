const { utils, error } = require("../lib");
const { PeddlerProductEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class Auth {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async createProduct(peddlerProductDto) {
		const { peddlerProductMapper } = this.mappers;

		const foundProduct = await peddlerProductMapper.findProduct({
			peddler: peddlerProductDto.peddler,
			product: peddlerProductDto.product,
		});

		if (foundProduct) {
			return Result.fail(
				new AppError({
					name: errorCodes.NameConflictError.name,
					message: errMessages.nameConflict,
					statusCode: errorCodes.NameConflictError.statusCode,
				})
			);
		} else {
			const newProduct = await peddlerProductMapper.createProduct(
				new PeddlerProductEnt(peddlerProductDto)
			);
			return Result.ok(newProduct.repr());
		}
	}

	async findProducts(peddlerProductFilterDto) {
		const { peddlerProductMapper } = this.mappers;

		const foundProducts = await peddlerProductMapper.findProducts(
			new PeddlerProductEnt(peddlerProductFilterDto)
		);

		if (foundProducts) {
			return Result.ok(
				foundProducts.map((eachProduct) => eachProduct.repr())
			);
		} else {
			return Result.ok([]);
		}
	}

	async updateProduct(peddlerProductDto) {
		const { peddlerProductMapper } = this.mappers;
		const peddlerProductEnt = new PeddlerProductEnt(peddlerProductDto);

		const updatedProduct = await peddlerProductMapper.updateProductById(
			peddlerProductEnt.id,
			peddlerProductEnt
		);

		return Result.ok(updatedProduct.repr());
	}
};
