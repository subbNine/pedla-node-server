const { utils } = require("../lib");
const { PeddlerProductEnt } = require("../entities/domain");
const { eventEmitter, eventTypes } = require("../events");

const { Result } = utils;

module.exports = class PeddlerProduct {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async createProducts(productDtoList) {
		const { peddlerProductMapper } = this.mappers;

		let resultList;
		const arrOfPromises = [];
		for (const peddlerProductDto of productDtoList) {
			const newProductPromise = peddlerProductMapper.createProduct(
				new PeddlerProductEnt(peddlerProductDto)
			);
			arrOfPromises.push(newProductPromise);
		}
		resultList = await Promise.all(arrOfPromises);

		return Result.ok(resultList.map((eachProduct) => eachProduct.toDto()));
	}

	async findProducts(peddlerProductFilterDto) {
		const { peddlerProductMapper } = this.mappers;

		const foundProducts = await peddlerProductMapper.findProducts(
			new PeddlerProductEnt(peddlerProductFilterDto)
		);

		if (foundProducts) {
			return Result.ok(foundProducts.map((eachProduct) => eachProduct.toDto()));
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

		const {
			residentialAmt,
			commercialAmt,
			commercialOnCrAmt,
		} = peddlerProductDto;

		if (
			updatedProduct &&
			(residentialAmt || commercialAmt || commercialOnCrAmt)
		) {
			eventEmitter.emit(
				eventTypes.priceOfProductUpdated,
				{ residentialAmt, commercialAmt, commercialOnCrAmt },
				peddlerProductEnt,
				peddlerProductEnt.peddler
			);
		}

		return Result.ok(updatedProduct.toDto());
	}
};
