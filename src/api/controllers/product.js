const BaseController = require("./base");
const { ProductDto, PeddlerProductDto } = require("../../entities/dtos");
const {
	product: productService,
	peddlerProduct: peddlerProductService,
} = require("../../services");

module.exports = class Product extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async createProduct(req, res, next) {
		const { name, description } = req.body;

		const productDto = new ProductDto();
		productDto.name = name;
		productDto.description = description;

		const result = await productService.createProduct(productDto);

		this.response(result, res);
	}

	async getProducts(req, res, next) {
		const { name, description } = req.query;
		const productDto = new ProductDto();

		productDto.name = name;
		productDto.description = description;

		const result = await productService.findProducts(productDto);

		this.response(result, res);
	}

	async updateProduct(req, res, next) {
		const { name, description, price } = req.body;
		const { productId } = req.params;

		const productDto = new UserDto();
		productDto.id = productId;
		productDto.name = name;
		productDto.description = description;
		productDto.price = +price;

		const result = await productService.updateProduct(productDto);

		this.response(result, res);
	}

	async createPeddlerProducts(req, res, next) {
		const { products } = req.body;
		const { user } = req._App;

		const productDtoList = [];
		for (const product of products) {
			const {
				productId,
				residentialAmt,
				commercialAmt,
				commercialOnCrAmt,
				quantity,
			} = product;

			const peddlerProductDto = new PeddlerProductDto();
			peddlerProductDto.peddler = user.id;
			peddlerProductDto.product = productId;
			peddlerProductDto.residentialAmt = +residentialAmt;
			peddlerProductDto.commercialAmt = +commercialAmt;
			peddlerProductDto.commercialOnCrAmt = +commercialOnCrAmt;
			peddlerProductDto.quantity = +quantity;

			productDtoList.push(peddlerProductDto);
		}

		const result = await peddlerProductService.createProducts(productDtoList);

		this.response(result, res);
	}

	async getPeddlerProducts(req, res, next) {
		const { peddlerId } = req.params;
		const peddlerProductDto = new PeddlerProductDto();

		const user = req._App.user;

		peddlerProductDto.peddler = peddlerId || user.id;

		const result = await peddlerProductService.findProducts(peddlerProductDto);

		this.response(result, res);
	}

	async updatePeddlerProduct(req, res, next) {
		const {
			residentialAmt,
			commercialAmt,
			commercialOnCrAmt,
			quantity,
		} = req.body;
		const { productId } = req.params;

		const peddlerProductDto = new PeddlerProductDto();
		peddlerProductDto.id = productId;

		if (residentialAmt) {
			peddlerProductDto.residentialAmt = residentialAmt;
		}
		if (commercialAmt) {
			peddlerProductDto.commercialAmt = commercialAmt;
		}
		if (commercialOnCrAmt) {
			peddlerProductDto.commercialOnCrAmt = commercialOnCrAmt;
		}
		if (quantity) {
			peddlerProductDto.quantity = quantity;
		}

		const result = await peddlerProductService.updateProduct(peddlerProductDto);

		this.response(result, res);
	}
};
