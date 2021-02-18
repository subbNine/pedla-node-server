const NotificationService = require("./notification");
const { utils } = require("../lib");

const { Result } = utils;

module.exports = class Message {
	constructor({ mappers }) {
		this.mappers = mappers;
	}

	async send(sender, { to, message, type }) {
		const { messageMapper } = this.mappers;

		const msgObj = {
			from: sender.id,
			message,
			type,
		};

		if (to) {
			msgObj.to = to;
		}

		const created = await messageMapper.create(msgObj);

		if (created && created.to) {
			const notificationService = new NotificationService({
				mappers: this.mappers,
			});

			const notificationObject = {
				title: "You have a message",
				receiverId: msgObj.to,
				senderId: msgObj.from,
				message,
			};

			notificationService
				.sendNotification(notificationObject)
				.then((result) => console.log(result))
				.catch(
					(e) =>
						new AppError(
							Object.assign(
								{
									name: errorCodes.InternalServerError.name,
									statusCode: errorCodes.InternalServerError.statusCode,
									isOperational: false,
								},
								e
							)
						)
				);
		}

		return Result.ok(created.repr());
	}

	async getRead(user, options) {
		const { messageMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit, page } = pagination || {};

		const totalReadMessages = await messageMapper.countRead(user);

		const totalPages = limit ? Math.ceil(totalReadMessages / +limit) : 1;

		const readMessages = await messageMapper.getReadMessages(user, {
			pagination: { limit: +limit || 30, page: page ? +page - 1 : 0 },
		});

		if (readMessages) {
			const results = [];

			for (const eachMessage of readMessages) {
				results.push(eachMessage.repr());
			}

			return Result.ok({
				data: results,
				pagination: {
					currentPage: +page || 1,
					totalPages,
					totalDocs: totalReadMessages,
				},
			});
		} else {
			return Result.ok(null);
		}
	}

	async getMessages(user, options) {
		const { messageMapper } = this.mappers;

		const { pagination } = options || {};
		const { limit = 30, page } = pagination || {};

		const totalMessages = await messageMapper.countAll(user);

		const totalPages = limit ? Math.ceil(totalMessages / +limit) : 1;

		const messages = await messageMapper.getAllMessages(user, {
			pagination: { limit: +limit, page: page ? +page - 1 : 0 },
		});

		if (messages) {
			const results = [];

			for (const eachMessage of messages) {
				results.push(eachMessage.repr());
			}

			return Result.ok({
				data: results,
				pagination: {
					currentPage: +page || 1,
					totalPages,
					totalDocs: totalMessages,
				},
			});
		} else {
			return Result.ok(null);
		}
	}

	async getLastMessage(user) {
		const { messageMapper } = this.mappers;

		const message = await messageMapper.getLastMessage(user);

		if (message) {
			return Result.ok(message.repr());
		} else {
			return Result.ok(null);
		}
	}

	async read(user) {
		const { messageMapper } = this.mappers;

		const read = await messageMapper.readAllUnread(user);

		if (read) {
			return Result.ok(true);
		} else {
			return Result.ok(null);
		}
	}
};
