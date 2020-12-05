const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	orderId: { type: Schema.Types.ObjectId, ref: "Order" },
	modeOfPayment: { type: String },
});

module.exports = mongoose.model("Payment", schema);
