const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	truckId: { type: Schema.Types.ObjectId, ref: "Truck" },
	driverId: { type: Schema.Types.ObjectId, ref: "User" },
	createdAt: { type: Date, default: Date.now },
	isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("TruckDriver", schema);
