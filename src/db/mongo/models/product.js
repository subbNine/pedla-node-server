const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	name: { type: String, required: true, unique: true, uppercase: true },
	description: String,
	createdAt: { type: Date, default: Date.now },
	price: Number,
});

module.exports = mongoose.model("Product", schema);
