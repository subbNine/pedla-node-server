const { INACTIVE_TTL } = require("../config");
const { OFFLINE, ONLINE } = require("../db/mongo/enums/user/presence");

module.exports = class Activity {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async logLastActive(user) {
		const { activityMapper } = this.mappers;

		await activityMapper.logLastActive(user);
	}

	setInactiveUsersOffline() {
		const { activityMapper } = this.mappers;

		return activityMapper.setInactiveUsersOffline(INACTIVE_TTL);
	}

	async getUserPresence(user) {
		const { activityMapper } = this.mappers;

		const userPresence = await activityMapper.getUserPresence(user);

		let presence = OFFLINE;
		if (userPresence && userPresence.online) {
			presence = ONLINE;
		}

		return presence;
	}
};
