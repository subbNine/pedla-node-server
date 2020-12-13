const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	truckNo: Number,
	name: String,
	owner: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Truck", schema);
