const { Seeder } = require("mongoose-data-seed");
const models = require("../models");

module.exports = class CountriesSeeder extends Seeder {
	generateSeedData() {
		const nigeria = {
			name: "Nigeria",
			iso3: "NGA",
			iso2: "NG",
			phone_code: "234",
			capital: "Abuja",
			currency: "NGN",
			native: "Nigeria",
			emoji: "🇳🇬",
			emojiU: "U+1F1F3 U+1F1EC",
		};

		return nigeria;
	}

	shouldRun() {
		this.seedData = this.generateSeedData();
		if (this.seedData) {
			return true;
		}
	}

	async run() {
		const { Country } = models;
		const seedData = this.seedData;
		const c = await Country.create({
			...seedData,
			phoneCode: seedData.phone_code,
		});

		return c;
	}
};
