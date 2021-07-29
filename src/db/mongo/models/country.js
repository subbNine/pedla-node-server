const mongoose = require("../connection");

const Schema = mongoose.Schema;

const schema = new Schema({
	name: { type: String, required: true },
	iso3: String,
	iso2: String,
	phoneCode: String,
	capital: String,
	currency: String,
	native: String,
	emoji: String,
	emojiU: String,
});

module.exports = mongoose.model("Country", schema);
