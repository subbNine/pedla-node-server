const mongoose = require("mongoose");
const seeders = require("./src/db/mongo/seeders");
const dotenv = require("dotenv");
dotenv.config();

const env = process.env.NODE_ENV;
let mongoURL;
if (env === "staging" || env === "production") {
	// Atlas connection setup
	const username = process.env.MONGO_USER;
	const password = process.env.MONGO_PW;
	const dbName = process.env.DB_NAME;

	mongoURL = `mongodb+srv://${username}:${password}@cluster0-u6dzg.mongodb.net/${dbName}?retryWrites=true&w=majority`;
} else {
	mongoURL = "mongodb://localhost:27017/peddler";
}

/**
 * Seeders List
 * order is important
 * @type {Object}
 */

module.exports.seedersList = {
	...seeders,
};
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
