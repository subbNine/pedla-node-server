module.exports = class Message {
	id;
	message;
	from;
	to;
	sentAt;
	readAt;
	type;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	// object representation of the domain entity.
	toDto() {
		const objectRepr = {};

		if (this.id) {
			objectRepr.id = this.id;
		}

		if (this.type) {
			objectRepr.type = this.type;
		}

		if (this.message) {
			objectRepr.content = this.message;
		}

		if (this.from) {
			if (this.from.toDto) {
				objectRepr.sender = this.from.toDto();
			} else {
				objectRepr.sender = this.from;
			}
		}

		if (this.sentAt) {
			objectRepr.sentAt = this.sentAt;
		}

		if (this.readAt) {
			objectRepr.readAt = this.readAt;
		} else {
			objectRepr.readAt = null;
		}

		return objectRepr;
	}
};
