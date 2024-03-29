const dotenv = require("dotenv");
dotenv.config();

const {
	NODE_ENV,
	MONGO_PW,
	MONGO_USER,
	MONGO_CONN_STRING_PROD,
	DB_NAME,
	PORT,
	TOKEN_SECRET,
	CLOUDINARY_SECRET,
	CLOUDINARY_API_KEY,
	CLOUDINARY_CLOUD_NAME,
	SMS_API_KEY,
	SMS_SENDER,
	EMAIL_SENDER,
	EMAIL_API_KEY,
	FCM_SERVER_KEY,
	PAYMENT_SK_TEST,
	PAYMENT_PK_TEST,
} = process.env;

const dbConf = {
	mongo: {
		production: {
			generateConnStr() {
				const pathToCAFile = require("path").resolve(__dirname,"../", "db/mongo/ca-certificate.crt")
				return MONGO_CONN_STRING_PROD.replace("%3Creplace-with-path-to-CA-cert%3E", pathToCAFile);
			},
		},
		staging: {
			DB_USER: MONGO_USER,
			DB_PW: MONGO_PW,
			DB_NAME: DB_NAME,
			generateConnStr() {
				return `mongodb+srv://${this.DB_USER}:${this.DB_PW}@cluster0-u6dzg.mongodb.net/${this.DB_NAME}?retryWrites=true&w=majority`;
			},
		},
		testing: {
			DB_USER: MONGO_USER,
			DB_PW: MONGO_PW,
			DB_NAME: DB_NAME,
			generateConnStr() {
				return `mongodb+srv://${this.DB_USER}:${this.DB_PW}@cluster0-u6dzg.mongodb.net/${this.DB_NAME}?retryWrites=true&w=majority`;
			},
		},
		development: {
			generateConnStr() {
				return "mongodb://localhost:27017/peddler";
			},
		},
	},
};

const APP_ENV = NODE_ENV || "development";

module.exports.dbConnStr = dbConf.mongo[APP_ENV].generateConnStr();
module.exports.jwtTokenSecret = TOKEN_SECRET;
module.exports.OTP_TOKEN_TTL = 7 * 60;
module.exports.INACTIVE_TTL = 20 * 60 * 1000;
module.exports.APP_ENV = APP_ENV;
module.exports.PORT = PORT || 4700;
module.exports.CLOUDINARY_CLOUD_NAME = CLOUDINARY_CLOUD_NAME;
module.exports.CLOUDINARY_API_KEY = CLOUDINARY_API_KEY;
module.exports.CLOUDINARY_SECRET = CLOUDINARY_SECRET;
module.exports.SMS_API_KEY = SMS_API_KEY;
module.exports.SMS_SENDER = SMS_SENDER;
module.exports.EMAIL_SENDER = EMAIL_SENDER;
module.exports.EMAIL_API_KEY = EMAIL_API_KEY;
module.exports.FCM_SERVER_KEY = FCM_SERVER_KEY;
module.exports.PAYMENT_SK_TEST = PAYMENT_SK_TEST;
module.exports.PAYMENT_PK_TEST = PAYMENT_PK_TEST;
