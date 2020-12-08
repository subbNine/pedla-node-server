const multer = require("multer");
// const path = require("path");

const cloudinaryStorage = require("./cloudinary-storage");
const {
	CLOUDINARY_API_KEY,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_SECRET,
} = require("../../../config");

const storage = cloudinaryStorage({
	config: {
		api_key: CLOUDINARY_API_KEY,
		api_secret: CLOUDINARY_SECRET,
		cloud_name: CLOUDINARY_CLOUD_NAME,
	},
	filename: (_req, file, cb) => {
		cb(
			null,
			`${Date.now()}${generateNumbers(5)}.${extractExtensionFromFileName(
				file.originalname
			)}`
		);
	},
	destination: "peddler_app",
});

// const fileStorage = multer.diskStorage({
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + "" + file.originalname);
// 	},
// 	destination: (req, file, cb) => {
// 		cb(null, path.join(req._App.rootDir, "uploads"));
// 	},
// });

const fileUpload = multer({ storage });

module.exports = fileUpload;

function generateNumbers(length = 4) {
	let nums = 0;

	for (let i = 0; i < length; ++i) {
		let n;
		if (i === 0) n = Math.ceil(Math.random() * 9);
		else n = Math.round(Math.random() * 9);
		nums = nums * 10 + n;
	}

	return nums;
}

function extractExtensionFromFileName(filename) {
	return ("" + filename).split(".").slice(-1).pop().trim();
}
