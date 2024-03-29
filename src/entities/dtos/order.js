const ProductDto = require("./product");
const UserDto = require("./user");

module.exports = class Order {
	id;
	driver = new UserDto();
	peddler = new UserDto();
	buyer = new UserDto();
	product = new ProductDto();
	quantity;
	unitAmount;
	rating;
	amount;
	status;
	driverLatlon;
	buyerLatlon;
	deliveryAddress;
	deliveryDate;
	creditPaymentDate;
	priceCategory;
};
