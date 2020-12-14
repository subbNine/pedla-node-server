const dbModels = require("../db/mongo/models");

const UserMapper = require("./user");
const SecretMapper = require("./secret");
const ProductMapper = require("./product");
const PeddlerProductMapper = require("./peddler-product");
const GeoMapper = require("./geo-location");
const TruckMapper = require("./truck");
const TruckDriverMapper = require("./truck-driver");

module.exports = {
	userMapper: new UserMapper(dbModels),
	secretMapper: new SecretMapper(dbModels),
	productMapper: new ProductMapper(dbModels),
	peddlerProductMapper: new PeddlerProductMapper(dbModels),
	geoMapper: new GeoMapper(dbModels),
	truckMapper: new TruckMapper(dbModels),
	truckDriverMapper: new TruckDriverMapper(dbModels),
};
