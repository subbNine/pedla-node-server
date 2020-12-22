const BaseMapper = require("./base");
const { PushDeviceEnt } = require("../entities/domain");

module.exports = class PushDevice extends BaseMapper {
	constructor(models) {
		super();
		this.models = models;
	}

	async updateOrCreatePushDevice(filter, updates) {
		const { PushDevice } = this.models;

		const doc = await PushDevice.findOneAndUpdate(
			this._toPersistence(filter, { user: "userId" }),
			this._toPersistence(updates, { user: "userId" }),
			{
				upsert: true,
			}
		);

		if (doc) {
			return this._toEntity(doc.toObject(), PushDeviceEnt, {
				_id: "id",
				userId: "user",
			});
		}
	}

	async findPushDevices(filter) {
		const { PushDevice } = this.models;

		const docs = await PushDevice.find(
			this._toPersistence(filter, { user: "userId" })
		);

		const results = [];
		if (docs) {
			for (const doc of docs) {
				results.push(
					this._toEntity(doc.toObject(), PushDeviceEnt, {
						_id: "id",
						userId: "user",
					})
				);
			}

			return results;
		}
	}

	async findPushDevice(filter) {
		const { PushDevice } = this.models;

		const doc = await PushDevice.findOne(
			this._toPersistence(filter, { user: "userId" })
		).sort("-createdAt");

		if (doc) {
			return this._toEntity(doc.toObject(), PushDeviceEnt, {
				_id: "id",
				userId: "user",
			});
		}
	}
};
