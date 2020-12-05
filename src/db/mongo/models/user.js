const mongoose = require("mongoose");
const presaveHook = require("../helpers/presave-hook");
const { permissions, types, presence } = require("../enums").user;

const Schema = mongoose.Schema;

let schema = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	userName: { type: String, required: true },
	email: { type: String },
	phoneNumber: { type: String },
	permission: {
		type: Number,
		enum: Object.values(permissions),
		required: true,
		default: permissions.PERM000,
	},
	password: { type: String, required: true },
	streetAddress: String,
	lga: { type: Schema.Types.ObjectId, ref: "Lga" },
	createdAt: { type: Date, default: Date.now },
	type: { type: String, enum: Object.values(types) },
	nTrucks: Number,
	pooImages: [
		{
			imgId: String,
			uri: String,
		},
	],
	avatarImage: {
		imgId: String,
		uri: String,
	},
	presence: {
		type: String,
		enum: Object.values(presence),
		default: presence.OFFLINE,
	},
});

schema.pre("save", presaveHook);

module.exports = mongoose.model("User", schema);
