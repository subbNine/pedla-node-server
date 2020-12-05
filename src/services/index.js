const mappers = require("../data-mappers");

const Auth = require("./auth");
const Otp = require("./otp");
const User = require("./user");
const Product = require("./product");
const PeddlerProduct = require("./peddler-product");
const Notification = require("./notification");
const Order = require("./order");
const GeoLocation = require("./geo-location");

module.exports = {
	auth: new Auth({ mappers }),
	otp: new Otp({ mappers }),
	user: new User({ mappers }),
	product: new Product({ mappers }),
	peddlerProduct: new PeddlerProduct({ mappers }),
	notification: new Notification({ mappers }),
	order: new Order({ mappers }),
	geoLocation: new GeoLocation({ mappers }),
};
