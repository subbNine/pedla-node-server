const mongoose = require("../connection");

let Schema = mongoose.Schema;

let schema = new Schema({
	secret: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Secret", schema);
