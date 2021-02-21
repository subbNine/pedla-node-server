const BaseController = require("./base");
const { message: messageService } = require("../../services");

module.exports = class Message extends BaseController {
	constructor() {
		super();
		this._bindAll(this);
	}

	async send(req, res, next) {
		const { content: message, type = 1, to } = req.body;
		const { user } = req._App;

		const result = await messageService.send(user, { to, message, type });

		return this.response(result, res);
	}

	async getRead(req, res, next) {
		const { limit, page } = req.query;

		const { user } = req._App;

		const result = await messageService.getRead(user, {
			pagination: { limit, page },
		});

		return this.response(result, res);
	}

	async getMessages(req, res, next) {
		const { limit, page } = req.query;

		const { user } = req._App;

		const result = await messageService.getMessages(user, {
			pagination: { limit, page },
		});

		return this.response(result, res);
	}

	async getUserMessages(req, res, next) {
		const { limit, page } = req.query;
		const { userId } = req.params;

		const result = await messageService.getUserMessages(userId, {
			pagination: { limit, page },
		});

		return this.response(result, res);
	}

	async getLastMessages(req, res, next) {
		const { limit, page } = req.query;

		const { user } = req._App;

		const result = await messageService.getLastMessages(user, {
			pagination: { limit, page },
		});

		return this.response(result, res);
	}

	async read(req, res, next) {
		const { user } = req._App;

		const result = await messageService.read(user);

		return this.response(result, res);
	}
};
