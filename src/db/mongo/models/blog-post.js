const mongoose = require("../connection");

let Schema = mongoose.Schema;

let schema = new Schema({
	title: String,
	body: String,
	image: {
		imgId: String,
		uri: String,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: Date,
	productId: { type: Schema.Types.ObjectId, ref: "Product" },
});

module.exports = mongoose.model("BlogPost", schema);
