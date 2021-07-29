function updatePushDevice(pushDeviceObject) {
	const { pushDeviceService } = require("../../services");

	pushDeviceService.updatePushDevice(pushDeviceObject);
}

module.exports = updatePushDevice;
