const { utils } = require("../lib");

const { Result } = utils;

module.exports = class PushDevice {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async updatePushDevice(pushDeviceUpdates) {
		const { pushDeviceMapper } = this.mappers;

		const filter = { user: pushDeviceUpdates.user };
		if (pushDeviceUpdates.platform) {
			filter.platform = ("" + pushDeviceUpdates.platform).toLowerCase();
		}

		const updated = await pushDeviceMapper.updateOrCreatePushDevice(
			filter,
			pushDeviceUpdates
		);

		if (updated) {
			return Result.ok(updated.toDto());
		}
	}
};
