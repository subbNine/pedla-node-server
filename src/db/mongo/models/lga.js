const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	name: { type: String, required: true },
	state: { type: Schema.Types.ObjectId, ref: "State", required: true },
});

module.exports = mongoose.model("Lga", schema);
