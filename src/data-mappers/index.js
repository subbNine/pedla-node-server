const dbModels = require("../db/mongo/models");

const UserMapper = require("./user");
const OtpMapper = require("./otp");
const ProductMapper = require("./product");
const PeddlerProductMapper = require("./peddler-product");

module.exports = {
	userMapper: new UserMapper(dbModels),
	otpMapper: new OtpMapper(dbModels),
	productMapper: new ProductMapper(dbModels),
	peddlerProductMapper: new PeddlerProductMapper(dbModels),
};
