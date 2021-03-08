const { utils, error } = require("../lib");
const { ProductEnt } = require("../entities/domain");

const AppError = error.AppError;
const errorCodes = error.errorCodes;
const errMessages = error.messages;
const { Result } = utils;

module.exports = class Product {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async createProduct(productDto) {
		const { productMapper } = this.mappers;

		const foundProduct = await productMapper.findProduct({
			name: ("" + productDto.name).toUpperCase(),
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
			const newProduct = await productMapper.createProduct(
				new ProductEnt(productDto)
			);
			return Result.ok(newProduct.toDto());
		}
	}

	async findProducts(productDto) {
		const { productMapper } = this.mappers;

		const foundProducts = await productMapper.findProducts(
			new ProductEnt(productDto)
		);

		if (foundProducts) {
			return Result.ok(
				foundProducts.map((eachProduct) => eachProduct.toDto())
			);
		} else {
			return Result.ok([]);
		}
	}

	async updateProduct(productDto) {
		const { productMapper } = this.mappers;
		const productEnt = new ProductEnt(productDto);

		const updatedProduct = await productMapper.updateProductById(
			productEnt.id,
			productEnt
		);

		return Result.ok(updatedProduct.toDto());
	}
};
