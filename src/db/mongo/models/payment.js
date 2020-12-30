const mongoose = require("../connection");
const { paymentStatus } = require("../enums/order");

const Schema = mongoose.Schema;

let schema = new Schema({
	orderId: { type: Schema.Types.ObjectId, ref: "Order" },
	buyerId: { type: Schema.Types.ObjectId, ref: "User" },
	driverId: { type: Schema.Types.ObjectId, ref: "User" },
	paymentMethod: { type: String },
	gatewayAccessCode: String,
	gatewayReference: String,
	status: { type: String, default: paymentStatus.NOTPAID },
	paymentReceipt: { imgId: String, uri: String },
});

module.exports = mongoose.model("Payment", schema);
