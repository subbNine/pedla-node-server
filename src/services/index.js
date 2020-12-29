const mappers = require("../data-mappers");

const Auth = require("./auth");
const Secret = require("./secret");
const User = require("./user");
const Product = require("./product");
const PeddlerProduct = require("./peddler-product");
const Notification = require("./notification");
const Order = require("./order");
const GeoLocation = require("./geo-location");
const Truck = require("./truck");
const TruckAndDriver = require("./truck-driver");
const OrderService = require("./order");
const PushDeviceService = require("./push-device");
const BlogPost = require("./blog-post");

module.exports = {
	auth: new Auth({ mappers }),
	secret: new Secret({ mappers }),
	user: new User({ mappers }),
	product: new Product({ mappers }),
	peddlerProduct: new PeddlerProduct({ mappers }),
	notification: new Notification({ mappers }),
	order: new Order({ mappers }),
	geoLocation: new GeoLocation({ mappers }),
	truck: new Truck({ mappers }),
	truckAndDriver: new TruckAndDriver({ mappers }),
	orderService: new OrderService({ mappers }),
	pushDeviceService: new PushDeviceService({ mappers }),
	blogPost: new BlogPost({ mappers }),
};
