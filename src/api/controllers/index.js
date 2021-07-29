const Auth = require("./auth");
const Secret = require("./secret");
const Product = require("./product");
const GeoLocation = require("./geo-location");
const Order = require("./order");
const User = require("./user");
const Truck = require("./truck");
const TruckAndDriver = require("./truck-driver");
const OrderController = require("./order");
const NotificationController = require("./notification");
const BlogPostController = require("./blog-post");
const SupportController = require("./support");

module.exports = {
	auth: new Auth(),
	secret: new Secret(),
	product: new Product(),
	geoLocation: new GeoLocation(),
	order: new Order(),
	user: new User(),
	truck: new Truck(),
	truckAndDriver: new TruckAndDriver(),
	orderController: new OrderController(),
	notificationController: new NotificationController(),
	blogPostController: new BlogPostController(),
	supportController: new SupportController(),
};
