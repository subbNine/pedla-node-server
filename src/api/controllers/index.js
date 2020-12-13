const Auth = require("./auth");
const Otp = require("./otp");
const Product = require("./product");
const GeoLocation = require("./geo-location");
const Order = require("./order");
const User = require("./user");
const Truck = require("./truck");

module.exports = {
	auth: new Auth(),
	otp: new Otp(),
	product: new Product(),
	geoLocation: new GeoLocation(),
	order: new Order(),
	user: new User(),
	truck: new Truck(),
};
