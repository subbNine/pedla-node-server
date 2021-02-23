const BaseMapper = require("./base");
const { Message: MessageEnt, UserEnt } = require("../entities/domain");

module.exports = class Message extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async countDocs(filter) {
		const { Message } = this.models;
		return await Message.countDocuments(filter);
	}

	async countAll(user) {
		const { Message } = this.models;
		let filter = {};
		if (user.isAdmin()) {
			filter = {
				$and: [{ $or: [{ to: { $exists: false } }, { from: user.id }] }],
			};
		} else {
			filter = {
				$and: [{ $or: [{ to: user.id }, { from: user.id }] }],
			};
		}
		return await Message.countDocuments(filter);
	}

	async countRead(user) {
		const { Message } = this.models;
		let filter = {};
		if (user.isAdmin()) {
			filter = {
				$and: [
					{ $or: [{ to: { $exists: false } }, { from: user.id }] },
					{ readAt: { $exists: true } },
				],
			};
		} else {
			filter = {
				$and: [
					{ $or: [{ to: user.id }, { from: user.id }] },
					{ readAt: { $exists: true } },
				],
			};
		}
		return await Message.countDocuments(filter);
	}

	async countUnread(user) {
		const { Message } = this.models;
		let filter = {};
		if (user.isAdmin()) {
			filter = {
				$and: [
					{ $or: [{ to: { $exists: false } }, { from: user.id }] },
					{ readAt: { $exists: false } },
				],
			};
		} else {
			filter = {
				$and: [
					{ $or: [{ to: user.id }, { from: user.id }] },
					{ readAt: { $exists: false } },
				],
			};
		}
		return await Message.countDocuments(filter);
	}

	async getAllMessages(user, options) {
		let filter = {};
		if (user.isAdmin()) {
			filter = {
				$and: [{ $or: [{ to: { $exists: false } }, { from: user.id }] }],
			};
		} else {
			filter = {
				$and: [{ $or: [{ to: user.id }, { from: user.id }] }],
			};
		}
		const res = await this._findMessages(filter, options);

		return res;
	}

	async getUserMessages(userId, options) {
		let filter = {
			$or: [
				{ to: userId, from: { $exists: true } },
				{ from: userId, to: { $exists: false } },
			],
		};

		const res = await this._findMessages(filter, options);

		return res;
	}

	async getLastMessages(_user, options) {
		const { Message } = this.models;

		const { pagination } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		const messages = await Message.aggregate([
			{
				$sort: { sentAt: -1 },
			},
			{
				$group: {
					_id: { thread: { $ifNull: ["$to", "$from"] } },
					from: { $last: "$from" },
					message: { $last: "$message" },
					sentAt: { $last: "$sentAt" },
					readAt: { $last: "$readAt" },
					type: { $last: "$type" },
				},
			},
			{ $limit: +limit },
			{ $skip: +page * +limit },
			{
				$lookup: {
					from: "users",
					let: { userId: "$from" },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ["$_id", "$$userId"],
								},
							},
						},
						{
							$project: {
								id: "$_id",
								firstName: 1,
								lastName: 1,
								userName: 1,
								email: 1,
								phoneNumber: 1,
								presence: 1,
								permission: 1,
							},
						},
					],
					as: "user",
				},
			},
			{ $unwind: "$user" },
			{
				$project: {
					_id: 0,
					user: 1,
					sentAt: 1,
					readAt: 1,
					type: 1,
					message: 1,
				},
			},
		]);

		console.log(messages);

		return messages;
	}

	async getReadMessages(user, options) {
		let filter = {};
		if (user.isAdmin()) {
			filter = {
				$and: [
					{ $or: [{ to: { $exists: false } }, { from: user.id }] },
					{ readAt: { $exists: true } },
				],
			};
		} else {
			filter = {
				$and: [
					{ $or: [{ to: user.id }, { from: user.id }] },
					{ readAt: { $exists: true } },
				],
			};
		}
		const res = await this._findMessages(filter, options);

		return res;
	}

	async _findMessages(filter, options) {
		const { Message } = this.models;

		const query = Message.find(filter)
			.populate("from")
			.populate("to")
			.sort("-sentAt");

		const { pagination } = options || {};

		const { limit = 0, page = 0 } = pagination || {};

		if (limit) {
			query.limit(+limit);

			query.skip(+limit * +page);
		}

		const docs = await query;

		const results = [];
		if (docs) {
			for (const doc of docs) {
				const msgObj = doc.toObject();

				msgObj.from = this._toEntity(msgObj.from, UserEnt, { _id: "id" });
				msgObj.to = this._toEntity(msgObj.to, UserEnt, { _id: "id" });

				results.push(
					this._toEntity(msgObj, MessageEnt, {
						_id: "id",
					})
				);
			}

			return results;
		}
	}

	async _findMessage(filter) {
		const { Message } = this.models;

		const query = Message.findOne(filter)
			.populate("from")
			.populate("to")
			.sort("-sentAt");

		const doc = await query;

		if (doc) {
			const msgObj = doc.toObject();

			msgObj.from = this._toEntity(msgObj.from, UserEnt, { _id: "id" });
			msgObj.to = this._toEntity(msgObj.to, UserEnt, { _id: "id" });

			return this._toEntity(msgObj, MessageEnt, {
				_id: "id",
			});
		}
	}

	async create(messageEnt) {
		const { Message, User } = this.models;

		const createQuery = Message.create(messageEnt);
		const toQuery = User.findById(messageEnt.to);

		const [newMessage, to] = await Promise.all([createQuery, toQuery]);

		const newMessageObj = newMessage.toObject();

		if (to) {
			newMessageObj.to = this._toEntity(to.toObject(), UserEnt, { _id: "id" });
		}

		if (newMessage) {
			return this._toEntity(newMessageObj, MessageEnt, {
				_id: "id",
			});
		}
	}

	async readAllUnread(user) {
		const { Message } = this.models;

		const doc = await Message.updateMany(
			{
				$and: [
					{ $or: [{ from: user.id }, { to: user.id }] },
					{ sentAt: { $lte: new Date() } },
					{ readAt: { $exists: false } },
				],
			},
			{
				readAt: new Date(),
			}
		);

		if (doc) {
			return doc;
		}
	}

	async read(messageId) {
		const { Message } = this.models;

		const doc = await Message.findByIdAndUpdate(
			messageId,
			{
				readAt: new Date(),
			},
			{ new: true }
		);

		if (doc) {
			return this._toEntity(doc.toObject(), MessageEnt, {
				_id: "id",
			});
		}
	}
};
