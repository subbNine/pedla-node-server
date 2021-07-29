const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	name: { type: String, required: true },
	country: { type: Schema.Types.ObjectId, ref: "Country" },
});

module.exports = mongoose.model("State", schema);
