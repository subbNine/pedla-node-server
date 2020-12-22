const BaseController = require("./base");
const { notification: notificationService } = require("../../services");

module.exports = class Notification extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async sendNotification(req, res, next) {
		const { title, receiverId, message, platform } = req.body;

		const { user } = req._App;

		const notificationObject = {
			title,
			receiverId,
			message,
			senderId: user.id,
			platform: platform ? ("" + platform).toLowerCase() : platform,
		};

		const result = await notificationService.sendNotification(
			notificationObject
		);

		return this.response(result, res);
	}
};
