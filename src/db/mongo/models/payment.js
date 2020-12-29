const mongoose = require("../connection");
const { paymentStatus } = require("../enums/order");

const Schema = mongoose.Schema;

let schema = new Schema({
	orderId: { type: Schema.Types.ObjectId, ref: "Order" },
	modeOfPayment: { type: String },
	gatewayAccessCode: String,
	gatewayReference: String,
	status: { type: String, default: paymentStatus.NOTPAID },
});

module.exports = mongoose.model("Payment", schema);
