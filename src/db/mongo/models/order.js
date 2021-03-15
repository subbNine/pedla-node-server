const mongoose = require("../connection");
const { order: orderEnums } = require("../enums");

const Schema = mongoose.Schema;

let schema = new Schema({
	driverId: { type: Schema.Types.ObjectId, ref: "User" },
	buyerId: { type: Schema.Types.ObjectId, ref: "User" },
	productId: { type: Schema.Types.ObjectId, ref: "PeddlersProduct" },
	quantity: Number,
	unitAmount: Number,
	rating: Number,
	amount: Number,
	status: {
		type: String,
		enum: Object.values(orderEnums.orderStatus),
		default: orderEnums.orderStatus.PENDING,
	},
	createdAt: { type: Date, default: Date.now },
	driverLatlon: {
		type: { type: String },
		coordinates: [{ type: Number, required: true }],
	},
	buyerLatlon: {
		type: { type: String },
		coordinates: [{ type: Number, required: true }],
	},
	cancelledReason: String,
	deliveryAddress: String,
	deliveryDate: Date,
	creditPaymentDate: Date,
	paymentMethod: { type: String, lowercase: true },
	priceCategory: String,
	deliveryStatus: {
		type: String,
		enum: Object.values(orderEnums.deliveryStatus),
		default: orderEnums.deliveryStatus.NOTDELIVERED,
	},
	truckId: { type: Schema.Types.ObjectId, ref: "Truck" },
	paid: { type: Boolean, default: false },
});

schema.index({ buyerLatlon: "2dsphere", driverLatlon: "2dsphere" });

module.exports = mongoose.model("Order", schema);
