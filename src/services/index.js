const mappers = require("../data-mappers");

const Auth = require("./auth");
const Secret = require("./secret");
const User = require("./user");
const Product = require("./product");
const PeddlerProduct = require("./peddler-product");
const Notification = require("./notification");
const GeoLocation = require("./geo-location");
const Truck = require("./truck");
const OrderService = require("./order");
const PushDeviceService = require("./push-device");
const BlogPost = require("./blog-post");
const Payment = require("./payment");
const Message = require("./support");
const Activity = require("./activity");

module.exports = {
	auth: new Auth({ mappers }),
	secret: new Secret({ mappers }),
	user: new User({ mappers }),
	product: new Product({ mappers }),
	peddlerProduct: new PeddlerProduct({ mappers }),
	notification: new Notification({ mappers }),
	geoLocation: new GeoLocation({ mappers }),
	truck: new Truck({ mappers }),
	orderService: new OrderService({ mappers }),
	pushDeviceService: new PushDeviceService({ mappers }),
	blogPost: new BlogPost({ mappers }),
	payment: new Payment({ mappers }),
	message: new Message({ mappers }),
	activity: new Activity({ mappers }),
};
