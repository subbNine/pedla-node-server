module.exports = class PushDevice {
	deviceToken = null;
	platform = null;
	user = null;
	isNotificationEnabled = null;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	repr() {
		return {
			deviceToken: this.deviceToken,
			platform: this.platform,
			user: this.user,
			isNotificationEnabled: this.isNotificationEnabled,
		};
	}
};
