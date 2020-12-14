const mongoose = require("mongoose");
const presaveHook = require("../helpers/presave-hook");
const { permissions, types, presence } = require("../enums").user;

const Schema = mongoose.Schema;

let schema = new Schema({
	firstName: { type: String },
	lastName: { type: String },
	userName: { type: String },
	email: { type: String, lowercase: true },
	phoneNumber: { type: String },
	permission: {
		type: Number,
		enum: Object.values(permissions),
		required: true,
		default: permissions.PERM000,
	},
	password: { type: String },
	streetAddress: String,
	lga: { type: Schema.Types.ObjectId, ref: "Lga" },
	createdAt: { type: Date, default: Date.now },
	type: { type: String, enum: Object.values(types) },
	nTrucks: Number,
	peddler: { type: Schema.Types.ObjectId, ref: "User" },
	pooImage: {
		imgId: String,
		uri: String,
	},
	avatarImg: {
		imgId: String,
		uri: String,
	},
	presence: {
		type: String,
		enum: Object.values(presence),
		default: presence.OFFLINE,
	},
	latlon: {
		type: { type: String },
		coordinates: [{ type: Number, required: true }],
	},
	peddlerCode: String,
	isActivePeddler: Boolean,
	isDisabled: { type: Boolean, default: false },
	isDeleted: { type: Boolean, default: false },
});

schema.index({ latlon: "2dsphere" });

schema.pre("save", presaveHook);

module.exports = mongoose.model("User", schema);
