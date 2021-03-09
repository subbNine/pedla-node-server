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
		const dto = {};

		if (this.id) {
			dto.id = this.id;
		}

		if (this.type) {
			dto.type = this.type;
		}

		if (this.message) {
			dto.content = this.message;
		}

		if (this.from) {
			if (this.from.toDto) {
				dto.sender = this.from.toDto();
			} else {
				dto.sender = this.from;
			}
		}

		if (this.sentAt) {
			dto.sentAt = this.sentAt;
		}

		if (this.readAt) {
			dto.readAt = this.readAt;
		} else {
			dto.readAt = null;
		}

		return dto;
	}
};
