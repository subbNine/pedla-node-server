module.exports = class Message {
	id;
	message;
	from;
	to;
	sentAt;
	readAt;

	constructor(fields = {}) {
		for (let key in fields) {
			if (fields[key]) {
				this[key] = fields[key];
			}
		}
	}

	// object representation of the domain entity.
	repr() {
		const objectRepr = {};

		if (this.id) {
			objectRepr.id = this.id;
		}

		if (this.message) {
			objectRepr.message = this.message;
		}

		if (this.from) {
			if (this.from.repr) {
				objectRepr.from = this.from.repr();
			} else {
				objectRepr.from = this.from;
			}
		}

		if (this.to) {
			if (this.to.repr) {
				objectRepr.to = this.to.repr();
			} else {
				objectRepr.to = this.to;
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
