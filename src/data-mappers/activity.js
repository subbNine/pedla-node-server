const BaseMapper = require("./base");
const { OFFLINE, ONLINE } = require("../db/mongo/enums/user/presence");

module.exports = class ActivityMapper extends BaseMapper {
	constructor(models, gateways) {
		super();
		this.models = models;
		this.gateways = gateways;
	}

	logLastActive(user) {
		const { User } = this.models;

		return User.findByIdAndUpdate(user.id, {
			lastActive: new Date(),
		}).then((doc, err) => {
			if (err) {
				throw err;
			}
		});
	}

	async setInactiveUsersOffline(inactiveTTL) {
		const { User } = this.models;
		const { pubSub } = this.gateways;

		const lastActive = Date.now() - inactiveTTL;

		const inactiveUsers = await User.find({
			presence: ONLINE,
			lastActive: { $lt: new Date(lastActive) },
		});

		if (inactiveUsers && inactiveUsers.length) {
			for (let eachInactiveUser of inactiveUsers) {
				const userId = eachInactiveUser._id.toString();

				eachInactiveUser.presence = OFFLINE;

				await Promise.all([
					eachInactiveUser.save(),
					pubSub.putUserOffline(userId),
				]);
			}
		}

		return true
	}
};
