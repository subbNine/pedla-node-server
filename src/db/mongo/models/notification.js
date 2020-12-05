const mongoose = require("../connection");

let Schema = mongoose.Schema;

let schema = new Schema({
	type: String,
	message: String,
	createdAt: { type: Date, default: Date.now },
	isSeen: { type: String, default: false },
	isRead: { type: String, default: false },
});

module.exports = mongoose.model("Notification", schema);
