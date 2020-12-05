const { Seeder } = require("mongoose-data-seed");

const Lga = require("../models/lga");
const State = require("../models/state");
const statesAndLgas = require("./states_and_lgas");

module.exports = class LgasSeeder extends Seeder {
	async generateSeedData() {
		const states = [];
		for (const state of statesAndLgas) {
			const stateName = state.state.name;
			const stateDoc = await State.findOne({ name: stateName });
			const locals = state.state.locals;
			const obj = { stateId: stateDoc._id, locals };
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
			const locals = state.locals;
			const stateId = state.stateId;

			for (const local of locals) {
				const newLocal = { ...local, state: stateId };
				asyncOps.push(Lga.create(newLocal));
			}
		}

		const results = await Promise.all(asyncOps);
		return results;
	}
};
