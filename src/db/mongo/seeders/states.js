const { Seeder } = require("mongoose-data-seed");

const Country = require("../models/country");
const State = require("../models/state");
const statesAndLgas = require("./states_and_lgas");

module.exports = class StatesSeeder extends Seeder {
	async generateSeedData() {
		const countryDoc = await Country.findOne({ iso3: "NGA" });
		const states = [];
		for (const state of statesAndLgas) {
			const obj = { country: countryDoc._id, name: state.state.name };
			states.push(obj);
		}

		return states;
	}

	async shouldRun() {
		this.seedData = await this.generateSeedData();
		if (this.seedData) {
			return true;
		}
	}

	async run() {
		const seedData = this.seedData;

		const asyncOps = [];
		for (const state of seedData) {
			asyncOps.push(State.create(state));
		}
		const results = await Promise.all(asyncOps);
		return results;
	}
};
