const mongoose = require("mongoose");
const seeders = require("./src/db/mongo/seeders");
const { dbConnStr } = require("./src/config");

const isProductionEnv = process.env.NODE_ENV === "production"

let mongoURL = dbConnStr;

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
let seedersList = {}

if (isProductionEnv) {
	seedersList.Products = seeders.Products
} else {
	seedersList = seeders
}

module.exports.seedersList = seedersList

/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
module.exports.connect = async () =>
	await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
module.exports.dropdb = async () => mongoose.connection.db.dropDatabase();
