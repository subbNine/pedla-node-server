const BaseMapper = require("./base");
const { OFFLINE, ONLINE } = require("../db/mongo/enums/user/presence");

module.exports = class ActivityMapper extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	logLastActive(user) {
		const { User } = this.models;

		return User.findByIdAndUpdate(user.id, {
			lastActive: new Date(),
		}).then((doc, err) => {
			if (err) {
				throw err;
			}

			if (doc) {
				console.log("update successful");
			}
		});
	}

	setInactiveUsersOffline(inactiveTTL) {
		const { User } = this.models;

		const lastActive = Date.now() - inactiveTTL;

		return User.updateMany(
			{ presence: ONLINE, lastActive: { $lt: new Date(lastActive) } },
			{ presence: OFFLINE }
		).then((doc, err) => {
			if (err) {
				throw err;
			}

			if (doc) {
				console.log("update successful");
			}
		});
	}
};
