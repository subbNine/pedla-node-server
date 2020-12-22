const { utils } = require("../lib");
const { eventEmitter, eventTypes } = require("../events");

const { Result } = utils;

module.exports = class Notification {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async sendNotification(notificationObject) {
		const { pushDeviceMapper } = this.mappers;

		const pushDeviceFilter = { user: notificationObject.receiverId };
		if (notificationObject.platform) {
			pushDeviceFilter.platform = notificationObject.platform;
		}

		const pushDevices = await pushDeviceMapper.findPushDevices(
			pushDeviceFilter
		);

		if (pushDevices) {
			const deviceTokens = pushDevices.map(
				(pushDevice) => pushDevice.deviceToken
			);

			eventEmitter.emit(
				eventTypes.sendNotification,
				Object.assign({}, notificationObject, { deviceTokens })
			);
		}

		return Result.ok(true);
	}

	// updateNotification() {}

	// getNotifications() {}
};
