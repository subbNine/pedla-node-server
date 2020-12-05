const mongoose = require("../connection");
const { order: orderEnums } = require("../enums");

const Schema = mongoose.Schema;

let schema = new Schema({
	peddlerId: { type: Schema.Types.ObjectId, ref: "User" },
	buyerId: { type: Schema.Types.ObjectId, ref: "User" },
	productId: { type: Schema.Types.ObjectId, ref: "Product" },
	quantity: Number,
	unitPrice: Number,
	rating: Number,
	amount: Number,
	status: { type: String, enum: Object.values(orderEnums.orderStatus) },
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", schema);
