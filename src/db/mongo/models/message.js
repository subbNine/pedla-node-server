const mongoose = require("../connection");

let Schema = mongoose.Schema;

let schema = new Schema({
	message: String,
	from: { type: Schema.Types.ObjectId, ref: "User" },
	to: { type: Schema.Types.ObjectId, ref: "User" },
	sentAt: { type: Date, default: Date.now },
	readAt: Date,
});

module.exports = mongoose.model("Message", schema);
