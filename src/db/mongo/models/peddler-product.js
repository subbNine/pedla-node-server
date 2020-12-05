const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	peddlerId: { type: Schema.Types.ObjectId, ref: "User" },
	productId: { type: Schema.Types.ObjectId, ref: "Product" },
	residentialAmt: Number,
	commercialAmt: Number,
	commercialOnCrAmt: Number,
	createdAt: { type: Date, default: Date.now },
	quantity: Number,
});

module.exports = mongoose.model("PedlersProduct", schema);
