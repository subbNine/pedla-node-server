const ProductDto = require("./product");
const UserDto = require("./user");

module.exports = class Truck {
	id;
	owner = new UserDto();
	model;
	brand;
	product = new ProductDto();
	size;
	license;
	insurance;
	worthiness;
	ownership;
};
