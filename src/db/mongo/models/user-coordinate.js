const mongoose = require("../connection");

const Schema = mongoose.Schema;

let schema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: "User" },
	latlon: {
		type: { type: String },
		coordinates: [{ type: Number, required: true }],
	},
});

schema.index({ latlon: "2dsphere" });

module.exports = mongoose.model("Coordinate", schema);
