const mongoose = require("mongoose");
const { platforms } = require("../enums").user;

const Schema = mongoose.Schema;

let schema = new Schema({
	deviceToken: String,
	platform: { type: String, enum: Object.values(platforms), lowercase: true },
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	isNotificationEnabled: Boolean,
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PushDevice", schema);
