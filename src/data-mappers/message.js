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

	async countRead(userId) {
		const { Message } = this.models;
		return await Message.countDocuments({
			$and: [
				{ $or: [{ to: userId }, { from: userId }] },
				{ readAt: { $exists: true } },
			],
		});
	}

	async countUnread(userId) {
		const { Message } = this.models;
		return await Message.countDocuments({
			$and: [
				{ $or: [{ to: userId }, { from: userId }] },
				{ readAt: { $exists: false } },
			],
		});
	}

	async getUnreadMessages(userId, options) {
		const res = await this._findMessages(
			{
				$and: [
					{ $or: [{ to: userId }, { from: userId }] },
					{ readAt: { $exists: false } },
				],
			},
			options
		);

		return res;
	}

	async getReadMessages(userId, options) {
		const res = await this._findMessages(
			{
				$and: [
					{ $or: [{ to: userId }, { from: userId }] },
					{ readAt: { $exists: true } },
				],
			},
			options
		);

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

	async create(messageEnt) {
		const { Message, User } = this.models;

		const createQuery = Message.create(messageEnt);
		const toQuery = User.findById(messageEnt.to);

		const [newMessage, to] = await Promise.all([createQuery, toQuery]);

		const newMessageObj = newMessage.toObject();

		newMessageObj.to = this._toEntity(to.toObject(), UserEnt, { _id: "id" });

		if (newMessage) {
			return this._toEntity(newMessageObj, MessageEnt, {
				_id: "id",
			});
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
