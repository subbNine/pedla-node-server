const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	truckNo: Number,
	name: String,
	ownerId: { type: Schema.Types.ObjectId, ref: "User" },
	model: String,
	brand: String,
	productId: { type: Schema.Types.ObjectId, ref: "Product" },
	productPrice: {
		residentialAmt: Number,
		commercialAmt: Number,
		commercialOnCrAmt: Number,
	},
	size: Number,
	license: { imgId: String, uri: String },
	insurance: { imgId: String, uri: String },
	worthiness: { imgId: String, uri: String },
	ownership: { imgId: String, uri: String },
	quantity: { type: Number, min: 0, default: 0 },
	isDeleted: { type: Boolean, default: false },
	driverId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Truck", schema);
