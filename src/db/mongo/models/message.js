const mongoose = require("../connection");

let Schema = mongoose.Schema;

let schema = new Schema({
	message: String,
	from: { type: Schema.Types.ObjectId, ref: "User" },
	to: { type: Schema.Types.ObjectId, ref: "User" },
	sentAt: { type: Date, default: Date.now },
	readAt: Date,
	type: { type: Number, default: 1 }, // 1 =text, 2=attachment
});

module.exports = mongoose.model("Message", schema);
