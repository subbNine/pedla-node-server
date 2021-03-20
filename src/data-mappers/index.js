const dbModels = require("../db/mongo/models");
const gateWays = require("../gateways");

const UserMapper = require("./user");
const SecretMapper = require("./secret");
const ProductMapper = require("./product");
const PeddlerProductMapper = require("./peddler-product");
const GeoMapper = require("./geo-location");
const TruckMapper = require("./truck");
const OrderMapper = require("./order");
const PushDeviceMapper = require("./push-device");
const BlogPostMapper = require("./blog-post");
const PaymentMapper = require("./payment");
const MessageMapper = require("./message");
const ActivityMapper = require("./activity");

module.exports = {
	userMapper: new UserMapper(dbModels, gateWays),
	secretMapper: new SecretMapper(dbModels, gateWays),
	productMapper: new ProductMapper(dbModels, gateWays),
	peddlerProductMapper: new PeddlerProductMapper(dbModels, gateWays),
	geoMapper: new GeoMapper(dbModels, gateWays),
	truckMapper: new TruckMapper(dbModels, gateWays),
	orderMapper: new OrderMapper(dbModels, gateWays),
	pushDeviceMapper: new PushDeviceMapper(dbModels, gateWays),
	blogPostMapper: new BlogPostMapper(dbModels, gateWays),
	paymentMapper: new PaymentMapper(dbModels, gateWays),
	messageMapper: new MessageMapper(dbModels, gateWays),
	activityMapper: new ActivityMapper(dbModels, gateWays),
};
